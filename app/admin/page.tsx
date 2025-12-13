"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Stats {
  totalUsers: number;
  totalSearches: number;
  totalFavorites: number;
  totalVisited: number;
  recentUsers: any[];
  topCities: { city: string; count: number }[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const userRole = (session.user as any)?.role;
      if (userRole !== "admin") {
        router.push("/");
      } else {
        fetchStats();
      }
    }
  }, [status, session, router]);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sl-SI", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-foreground"></div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading stats</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface p-6 rounded-xl shadow">
            <h3 className="text-muted text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow">
            <h3 className="text-muted text-sm mb-2">Total Searches</h3>
            <p className="text-3xl font-bold text-foreground">{stats.totalSearches}</p>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow">
            <h3 className="text-muted text-sm mb-2">Total Favorites</h3>
            <p className="text-3xl font-bold text-foreground">{stats.totalFavorites}</p>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow">
            <h3 className="text-muted text-sm mb-2">Visited Restaurants</h3>
            <p className="text-3xl font-bold text-foreground">{stats.totalVisited}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Users</h2>
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user._id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{user.username}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                  </div>
                  <p className="text-xs text-muted">{formatDate(user.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-foreground mb-4">Most Searched Cities</h2>
            <div className="space-y-3">
              {stats.topCities.map((item, index) => (
                <div key={item.city} className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                    <p className="font-semibold text-foreground capitalize">{item.city}</p>
                  </div>
                  <span className="text-sm text-muted">{item.count} searches</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push("/admin/users")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
          >
            Manage Users
          </button>
          <button
            onClick={() => router.push("/studio")}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Open Sanity Studio
          </button>
        </div>
      </div>
    </div>
  );
}