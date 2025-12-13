"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ActivitiesSkeleton from "../skeletons/ActivitiesSkeleton";

interface SearchHistory {
  _id: string;
  city: string;
  searchedAt: string;
}

interface VisitedRestaurant {
  _id: string;
  placeId: string;
  name: string;
  address: string;
  visitedAt: string;
}

interface FavoriteRestaurant {
  _id: string;
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  notes?: string;
  savedAt: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"visited" | "favorites" | "searches">("visited");
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [visitedRestaurants, setVisitedRestaurants] = useState<VisitedRestaurant[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]); 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchAllData();
    }
  }, [status, router]);

  async function fetchAllData() {
    setLoading(true);
    await Promise.all([
      fetchSearchHistory(),
      fetchVisitedRestaurants(),
      fetchFavorites(),
    ]);
    setLoading(false);
  }

  async function fetchSearchHistory() {
    try {
      const res = await fetch("/api/history/search");
      const data = await res.json();
      setSearchHistory(data.searches || []);
    } catch (err) {
      console.error("Failed to fetch search history:", err);
    }
    
  }

  async function fetchVisitedRestaurants() {
    try {
      const res = await fetch("/api/visited");
      const data = await res.json();
      setVisitedRestaurants(data.visited || []);
    } catch (err) {
      console.error("Failed to fetch visited restaurants:", err);
    }
  }

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  }

  async function deleteSearchHistory(searchId?: string) {
    try {
      setLoadingSearch(true);
      await fetch("/api/history/search", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchId }),
      });
      fetchSearchHistory();
    } catch (err) {
      console.error("Failed to delete search history:", err);
    }
    setLoadingSearch(false);
  }

  async function removeFavorite(favoriteId: string) {
    try {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteId }),
      });
      fetchFavorites();
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sl-SI", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (status === "loading" || loading) {
    return (
      <ActivitiesSkeleton />
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Your Activity</h1>

        
        <div className="flex gap-4 mb-8 border-b border-muted">
          <button
            onClick={() => setActiveTab("visited")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "visited"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Visited ({visitedRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "favorites"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("searches")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "searches"
                ? "text-primary border-b-2 border-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            Search History ({searchHistory.length})
          </button>
        </div>

        
        {activeTab === "visited" && (
          <div className="space-y-4">
            {visitedRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-lg">No visited restaurants yet</p>
                <p className="text-sm text-muted mt-2">
                  Start exploring restaurants and they'll appear here!
                </p>
              </div>
            ) : (
                
              <div className="mt-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-1 gap-6 rounded-4xl">
        {visitedRestaurants.map((r) => {
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            r.name + " " + (r.address || "")
          )}`;

          return (
            <a
              key={r._id}
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative bg-surface p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden group w-full"
            >
              <div className="rounded-xl absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              
              <div className="relative z-10">
                    <h2 className="text-xl font-semibold text-foreground">
                        {r.name}
                    </h2>
                <p className="text-muted mt-1 group-hover:text-white/80 transition-colors duration-500">{r.address}</p>
                <p className="text-sm text-muted mt-2 group-hover:text-white/80 transition-colors duration-500">
                   Visited: {formatDate(r.visitedAt)}
                </p>
              </div>
            </a>
          );
        })}
      </div>
            )}
          </div>
        )}

        
        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-lg">No favorite restaurants yet</p>
                <p className="text-sm text-muted mt-2">
                  Add restaurants to your favorites to see them here!
                </p>
              </div>
            ) : (
              favorites.map((favorite) => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  favorite.name + " " + (favorite.address || "")
                )}`;
                
                return (
                  <div
                    key={favorite._id}
                    className="bg-surface p-6 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-foreground">
                            {favorite.name}
                          </h3>
                          {favorite.rating && (
                            <span className="text-yellow-600 font-medium">
                              ⭐ {favorite.rating}/5
                            </span>
                          )}
                        </div>
                        <p className="text-muted mt-1">{favorite.address}</p>
                        {favorite.notes && (
                          <p className="text-sm text-foreground mt-2 italic">
                            "{favorite.notes}"
                          </p>
                        )}
                        <p className="text-sm text-muted mt-2">
                          Saved: {formatDate(favorite.savedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                        >
                          View
                        </a>
                        <button
                          onClick={() => removeFavorite(favorite._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        
        {activeTab === "searches" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted">Your recent city searches</p>
            {searchHistory.length > 0 && !loadingSearch && (
              <button
                onClick={() => deleteSearchHistory()}
                className="text-muted interactive-text cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
            {loadingSearch ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface p-4 rounded-xl shadow animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : searchHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-lg">No search history yet</p>
                <p className="text-sm text-muted mt-2">
                  Start searching for restaurants and your history will appear here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchHistory.map((search) => (
                  <div
                    key={search._id}
                    className="bg-surface p-4 rounded-xl shadow hover:shadow-lg transition group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {search.city}
                        </h3>
                        <p className="text-sm text-muted mt-1">
                          {formatDate(search.searchedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSearchHistory(search._id)}
                        className="interactive-text opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                    <button
                      onClick={() => router.push(`/?city=${encodeURIComponent(search.city)}`)}
                      className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors text-sm"
                    >
                      Search Again
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}