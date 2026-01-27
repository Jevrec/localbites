describe("MainPage", () => {
  it("iskanje restavracij", () => {
    // Mock the search API
    cy.intercept("POST", "/api/search", (req) => {

      expect(req.body).to.have.property("city", "Ljubljana");
      expect(req.body).to.have.property("radius");
      expect(req.body).to.have.property("maxResults");

      expect(req.body.radius).to.eq(5000);
      expect(req.body.maxResults).to.eq(20);

      req.reply({
        statusCode: 200,
        body: {
          restaurants: [
            {
              place_id: "place_1",
              name: "Test Restaurant 1",
              vicinity: "Main Street 1",
              rating: 4.6,
            },
            {
              place_id: "place_2",
              name: "Test Restaurant 2",
              vicinity: "River Road 2",
              rating: 4.2,
            },
          ],
        },
      });
    }).as("searchReq");

    cy.visit("http://localhost:3000/");


    cy.contains("No restaurants found yet.").should("be.visible");
    cy.get('input[placeholder="Enter a city..."]')
      .should("be.visible")
      .type("Ljubljana");

    cy.contains("button", "Search").should("not.be.disabled").click();

    cy.wait("@searchReq");

    cy.contains("Test Restaurant 1").should("be.visible");
    cy.contains("Main Street 1").should("be.visible");
    cy.contains("4.6 / 5").should("be.visible");

    cy.contains("Test Restaurant 2").should("be.visible");
    cy.contains("River Road 2").should("be.visible");
    cy.contains("4.2 / 5").should("be.visible");

    // Verify the first card is a link to Google Maps with encoded query
    cy.contains("Test Restaurant 1")
      .closest("a")
      .should("have.attr", "href")
      .and("include", "https://www.google.com/maps/search/?api=1&query=")
      .and("include", encodeURIComponent("Test Restaurant 1 Main Street 1"));
  });

  it("leh išče glede na URL z parametru ?city=...", () => {
    cy.intercept("POST", "/api/search", (req) => {
      expect(req.body.city).to.eq("Maribor");
      req.reply({
        statusCode: 200,
        body: {
          restaurants: [
            {
              place_id: "place_3",
              name: "Maribor Bistro",
              vicinity: "Center 3",
              rating: 4.0,
            },
          ],
        },
      });
    }).as("searchReqUrl");

    cy.visit("http://localhost:3000/?city=Maribor");

    cy.wait("@searchReqUrl");
    cy.contains("Maribor Bistro").should("be.visible");
    cy.contains("Center 3").should("be.visible");
  });
});
