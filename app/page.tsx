"use client";

import { useState } from "react";
import { GooglePlace } from "@/app/types/google";

export default function Home() {
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!city.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) {
        setLoading(false);
        alert("API Error: " + res.status);
        return;
      }

      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch (err) {
      alert("Network error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Restaurant Finder
      </h1>

      <div className="flex gap-3 w-full max-w-md">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city..."
          className="flex-1 px-4 py-2 text-foreground rounded-lg border shadow-sm focus:ring-2 focus:ring-muted"
        />

        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-primary text-foreground rounded-lg shadow-md hover:bg-accent transition"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="mt-10 animate-spin rounded-full h-12 w-12 border-t-4 border-foreground border-solid"></div>
      )}

      <div className="mt-10 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((r) => (
          <div
            key={r.place_id}
            className="bg-surface p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-foreground">{r.name}</h2>
            <p className="text-muted mt-1">{r.vicinity}</p>
            {r.rating && (
              <p className="mt-2 text-yellow-600 font-medium">
                {r.rating} / 5
              </p>
            )}
          </div>
        ))}
      </div>

      {!loading && restaurants.length === 0 && (
        <p className="mt-10 text-foreground">No restaurants found yet.</p>
      )}
    </div>
  );
}
