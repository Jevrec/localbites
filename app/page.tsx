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
    console.log("API request received:", city);
    
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
      <div className="relative overflow-hidden bg-background">
        <div className="flex items-center justify-between px-10 py-20 max-w-7xl mx-auto">
          <div className="flex-1 max-w-2xl z-10">            
            <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
              Find restaurants in {" "}
              <span className="text-primary">any city / town</span>
            </h1>
            
            <p className="text-muted text-lg mb-8 max-w-md">
              Discover fresh restaurants every morning in your city without getting lost in endless options.
            </p>
            
            <div className="flex gap-3 mb-4">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter a city..."
                className="flex-1 max-w-sm px-5 py-3 text-foreground rounded-lg border-2 border-muted shadow-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              />
              <button
                onClick={handleSearch}
                className="px-5 py-2 bg-primary text-foreground rounded-lg shadow-md hover:bg-accent transition"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 relative">
            <img 
              src="/images/Z_NIGHT_ROUND_CUSTOM.webp" 
              alt="Image" 
              className="w-[500px] h-auto relative z-10 rounded-full"
            />            
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-spin"></div>
      )}

      <div className="mt-30 w-full max-w-2xl grid grid-cols-1 md:grid-cols-1 gap-6 rounded-4xl">
        {restaurants.map((r) => {
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            r.name + " " + (r.vicinity || "")
          )}`;

        return (
          <a
                    key={r.place_id}
          href={mapUrl}
          target="_blank"
          className="relative bg-surface p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden group"
        >
          <div className="rounded-xl absolute inset-0 bg-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-foreground group-hover:text-white transition-colors duration-500">
              {r.name}
            </h2>
            <p className="text-muted mt-1 group-hover:text-white/80 transition-colors duration-500">
              {r.vicinity}
            </p>
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
        <p className="mt-10 text-foreground bg-surface p-10 rounded-4xl">No restaurants found yet.</p>
      )}
    </div>
  );
}
