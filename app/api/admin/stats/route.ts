import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await sanity.fetch(
      `count(*[_type == "user"])`
    );

    const totalSearches = await sanity.fetch(
      `count(*[_type == "searchHistory"])`
    );

    const totalFavorites = await sanity.fetch(
      `count(*[_type == "favoriteRestaurant"])`
    );

    const totalVisited = await sanity.fetch(
      `count(*[_type == "visitedRestaurant"])`
    );

    const recentUsers = await sanity.fetch(
      `*[_type == "user"] | order(createdAt desc)[0...5] {
        _id,
        username,
        email,
        createdAt
      }`
    );

    const popularCities = await sanity.fetch(
      `*[_type == "searchHistory"] {
        city
      } | order(count(city) desc)`
    );

    const cityCount: { [key: string]: number } = {};
    popularCities.forEach((item: any) => {
      const city = item.city.toLowerCase();
      cityCount[city] = (cityCount[city] || 0) + 1;
    });

    const topCities = Object.entries(cityCount)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalUsers,
      totalSearches,
      totalFavorites,
      totalVisited,
      recentUsers,
      topCities,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}