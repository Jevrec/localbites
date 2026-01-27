//zaradi API je bols .ts names .js
describe("HistoryPage", () => {
  const base = "http://localhost:3000";

  // Helpers: mock API responses
  const mockAllData = (overrides?: Partial<{
    searches: any[];
    visited: any[];
    favorites: any[];
  }>) => {
    const searches =
      overrides?.searches ??
      [
        { _id: "s1", city: "Ljubljana", searchedAt: "2026-01-20T10:30:00.000Z" },
        { _id: "s2", city: "Maribor", searchedAt: "2026-01-21T12:00:00.000Z" },
      ];

    const visited =
      overrides?.visited ??
      [
        {
          _id: "v1",
          placeId: "p1",
          name: "Visited One",
          address: "Addr 1",
          visitedAt: "2026-01-22T08:00:00.000Z",
        },
      ];

    const favorites =
      overrides?.favorites ??
      [
        {
          _id: "f1",
          placeId: "p2",
          name: "Fav One",
          address: "Fav Addr",
          rating: 4.5,
          notes: "Nice",
          savedAt: "2026-01-23T09:00:00.000Z",
        },
      ];

    cy.intercept("GET", "/api/history/search", { statusCode: 200, body: { searches } }).as(
      "getSearchHistory"
    );
    cy.intercept("GET", "/api/visited", { statusCode: 200, body: { visited } }).as("getVisited");
    cy.intercept("GET", "/api/favorites", { statusCode: 200, body: { favorites } }).as(
      "getFavorites"
    );
  };

  const mockSession = (status: "authenticated" | "unauthenticated") => {
    if (status === "authenticated") {
      cy.intercept("GET", "/api/auth/session", {
        statusCode: 200,
        body: { user: { name: "Test", email: "test@test.com" }, expires: "2099-01-01" },
      }).as("session");
    } else {
      cy.intercept("GET", "/api/auth/session", { statusCode: 200, body: null }).as("session");
    }
  };

  it("če nisi logiran te preusmeri na /login", () => {
    mockSession("unauthenticated");
    cy.visit(`${base}/history`);

    // If the app redirects client-side, URL should become /login
    cy.location("pathname", { timeout: 10000 }).should("eq", "/login");
  });

  it("naloži vse aktivnosti in prikaže pravilno št zavihkov", () => {
    mockSession("authenticated");
    mockAllData();

    cy.visit(`${base}/history`);

    // wait for initial load calls
    cy.wait("@getSearchHistory");
    cy.wait("@getVisited");
    cy.wait("@getFavorites");

    cy.contains("Your Activity").should("be.visible");

    // counts in tab buttons
    cy.contains(/Visited\s*\(1\)/).should("be.visible");
    cy.contains(/Favorites\s*\(1\)/).should("be.visible");
    cy.contains(/Search History\s*\(2\)/).should("be.visible");

    // default tab is visited -> visited item shown
    cy.contains("Visited One").should("be.visible");
    cy.contains("Addr 1").should("be.visible");
    cy.contains(/Visited:/).should("be.visible");
  });

  it("zameja tabe visited=favorites=history", () => {
    mockSession("authenticated");
    mockAllData();

    cy.visit(`${base}/history`);
    cy.wait("@getVisited");
    cy.wait("@getFavorites");
    cy.wait("@getSearchHistory");

    // Favorites tab content
    cy.contains(/Favorites\s*\(1\)/).click();
    cy.contains("Fav One").should("be.visible");
    cy.contains("Fav Addr").should("be.visible");
    cy.contains("⭐ 4.5/5").should("be.visible");
    cy.contains('"Nice"').should("be.visible");

    // Search history tab content
    cy.contains(/Search History\s*\(2\)/).click();
    cy.contains("Your recent city searches").should("be.visible");
    cy.contains("Ljubljana").should("be.visible");
    cy.contains("Maribor").should("be.visible");
    cy.contains("Search Again").should("be.visible");
  });

  it("ponovno iskanje", () => {
    mockSession("authenticated");
    mockAllData({
      searches: [{ _id: "s1", city: "Novo mesto", searchedAt: "2026-01-21T12:00:00.000Z" }],
      visited: [],
      favorites: [],
    });

    cy.visit(`${base}/history`);
    cy.wait("@getSearchHistory");

    cy.contains("Search History").click();

    cy.contains("Novo mesto").should("be.visible");
    cy.contains("button", "Search Again").click();

    cy.location("pathname").should("eq", "/");
    cy.location("search").should("include", "city=Novo%20mesto");
  });
});
