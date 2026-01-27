"use client";

import { useEffect, useState } from "react";
import { GooglePlace } from "@/app/types/google";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function MainPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // Search input + rezultati
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState<GooglePlace[]>([]);

  // UI stanje: ali se iskanje izvaja, ali se resultati nalagajo...
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // zgodovina iskanj prijavljenega uporabnika (se vidi samo ko je prijavljen)
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  // advanced nastavitve: pošlje radius na API /api/search
  const [radius, setRadius] = useState(5000); // metri (default 5km)
  const [maxResults, setMaxResults] = useState(20); // default 20

  /**
   * helper: pomaga UI funkciji da izvede search z majhnim delayem
   * uporabi se ko user klikne na "quick search" chip iz zgodovine iskanj
   */
  const runSearchWithSmallDelay = (searchCity: string) => {
    setTimeout(() => performSearch(searchCity), 100);
  };

  /**
   * Če URL vsebuje ?city=..., avtomatsko izvede search (shareable link).
   */
  useEffect(() => {
    const cityFromUrl = searchParams.get("city");
    if (!cityFromUrl) return;

    setCity(cityFromUrl);
    runSearchWithSmallDelay(cityFromUrl);
  }, [searchParams]);

  /**
   * Ko je user prijavljen, pokažemo njegove "Recent searches".
   */
  useEffect(() => {
    if (session) fetchSearchHistory();
  }, [session]);

  async function fetchSearchHistory() {
    try {
      const res = await fetch("/api/history/search");
      const data = await res.json();
      setSearchHistory(data.searches || []);
    } catch (err) {
      console.error("Failed to fetch search history:", err);
    }
  }

  /**
   * Centralna funkcija za iskanje:
   * 1) (če je user prijavljen) shrani iskanje v zgodovino
   * 2) kliče /api/search in prikaže rezultate
   */
  async function performSearch(searchCity: string) {
    if (!searchCity.trim()) return;

    setLoading(true);
    setRestaurants([]); // počisti prejšnje rezultate
    // Logged-in uporabniki: shrani search v zgodovino (ne blokira main searcha)
    if (session) {
      try {
        await fetch("/api/history/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city: searchCity }),
        });
        fetchSearchHistory(); // refresh zgodovine
      } catch (err) {
        console.error("Failed to save search history:", err);
      }
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: searchCity,
          radius,
          maxResults,
        }),
      });

      // Backend error (npr. invalid request / quota)
      if (!res.ok) {
        alert("API Error: " + res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch (err) {
      // Network-level problem (offline, server down)
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  // ročno sproži iskanje 
  async function handleSearch() {
    await performSearch(city);
  }

  // iskanje preko hitrega klika na chip iz zgodovine iskanja
  async function handleQuickSearch(searchCity: string) {
    setCity(searchCity);
    runSearchWithSmallDelay(searchCity);
  }

  /**
   * izbriši en vnos iz zgodovine iskanj
   */
  async function deleteSearchHistory(searchId?: string) {
    try {
      await fetch("/api/history/search", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchId }),
      });
      fetchSearchHistory();
    } catch (err) {
      console.error("Failed to delete search history:", err);
    }
  }

  /**
   * shrani iskane restavracije v zgodovino
   * triggera se ko user klikne na restavracijo v rezultatih (google maps link)
   */
  async function trackVisit(restaurant: GooglePlace) {
    if (!session) return;

    try {
      await fetch("/api/visited", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: restaurant.place_id,
          name: restaurant.name,
          address: restaurant.vicinity,
        }),
      });
    } catch (err) {
      console.error("Failed to track visit:", err);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-4">
      {/* Hero / Search section */}
      <div className="relative overflow-hidden bg-background">
        <div className="flex items-start justify-between px-10 py-20 max-w-7xl mx-auto">
          <div className="flex-1 max-w-2xl z-10">
            <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
              Find restaurants in <span className="text-primary">any city / town</span>
            </h1>

            <p className="text-muted text-lg mb-8 max-w-md">
              Discover fresh restaurants every morning in your city without getting lost in endless options.
            </p>

            {/* samo za auth uporabnike */}
            {session && searchHistory.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted mb-2">Recent searches</p>

                <div className="flex flex-wrap gap-2 mb-4 w-2/3">
                  {searchHistory.map((search) => (
                    <div key={search._id} className="group relative">
                      <button
                        onClick={() => handleQuickSearch(search.city)}
                        className="px-3 py-1 bg-muted/20 hover:bg-primary/20 rounded-full text-sm text-foreground transition-colors"
                      >
                        {search.city}
                      </button>

                      {/* delete ikona (on hover) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSearchHistory(search._id);
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search input */}
            <div className="flex gap-3 mb-4">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a city..."
                className="flex-1 max-w-sm px-5 py-3 text-foreground rounded-lg border-2 border-muted shadow-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              />
              <button onClick={handleSearch} disabled={loading} className="btn disabled:opacity-50">
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* napredne nastavitve */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-muted hover:text-foreground transition-colors mb-2"
            >
              {showAdvanced ? "▼" : "▶"} Advanced Options
            </button>

            {/* napredne nastavitve spremnijo request za /api/search */}
            {showAdvanced && (
              <div className="bg-surface p-4 rounded-lg mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Search Radius: {radius / 1000}km
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Maximum Results: {maxResults}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* hitri preseti shranijo radius in maxResults za common use primere */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Quick Presets:</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setRadius(2000);
                        setMaxResults(5);
                      }}
                      className="px-3 py-1 bg-muted/20 hover:bg-primary/20 rounded text-xs transition-colors"
                    >
                      Nearby (2km, 5 results)
                    </button>

                    <button
                      onClick={() => {
                        setRadius(5000);
                        setMaxResults(10);
                      }}
                      className="px-3 py-1 bg-muted/20 hover:bg-primary/20 rounded text-xs transition-colors"
                    >
                      Local (5km, 10 results)
                    </button>

                    <button
                      onClick={() => {
                        setRadius(15000);
                        setMaxResults(20);
                      }}
                      className="px-3 py-1 bg-muted/20 hover:bg-primary/20 rounded text-xs transition-colors"
                    >
                      Wide (15km, 20 results)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 relative hidden lg:block">
            <img
              src="/images/Z_NIGHT_ROUND_CUSTOM.webp"
              alt="Image"
              className="w-[500px] h-auto relative z-10 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* spinner za full-page loading */}
      {loading && (
        <div className="mt-10 animate-spin rounded-full h-12 w-12 border-t-4 border-foreground border-solid"></div>
      )}

      {/* Results */}
      <div className="mt-10 w-full max-w-2xl grid grid-cols-1 md:grid-cols-1 gap-6 rounded-4xl">
        {restaurants.map((r) => {
          // Google Maps deep link
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            r.name + " " + (r.vicinity || "")
          )}`;

          return (
            <a
              key={r.place_id}
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackVisit(r)}
              className="relative bg-surface p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden group"
            >
              <div className="rounded-xl absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-foreground group-hover:text-white transition-colors duration-500">
                  {r.name}
                </h2>

                <p className="text-muted mt-1 group-hover:text-white/80 transition-colors duration-500">
                  {r.vicinity}
                </p>

                {/* Rating je optional -> render only če je backend vrnil rating */}
                {r.rating && (
                  <p className="mt-2 text-yellow-600 font-medium group-hover:text-yellow-300 transition-colors duration-500">
                    {r.rating} / 5
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {!loading && restaurants.length === 0 && (
        <p className="mt-10 text-foreground bg-surface p-10 rounded-4xl">
          No restaurants found yet.
        </p>
      )}
    </div>
  );
}
