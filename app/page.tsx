"use client";
import { useState } from "react";

export default function Home() {
  const [town, setTown] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await fetch(`/api/restaurants?town=${encodeURIComponent(town)}`);
    const data = await res.json();
    setRestaurants(data.restaurants || []);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Find Restaurants by Town</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          placeholder="Enter a town name..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-primary hover:bg-accent px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <ul className="mt-6 space-y-3">
        {restaurants.map((r, i) => (
          <li key={i} className="border border-muted p-3 rounded">
            <strong>{r.name || "Unnamed Restaurant"}</strong><br />
            <span className="text-sm text-muted">
              {r.address || "No address available"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
