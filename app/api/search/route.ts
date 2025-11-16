import { NextResponse } from "next/server";
import { GooglePlace } from "@/app/types/google";

export async function POST(req: Request) {
  try {
    const { city } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results.length) {
      return NextResponse.json({ restaurants: [] });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&key=${apiKey}`
    );

    const placesData = await placesRes.json();

    return NextResponse.json({
      restaurants: (placesData.results as GooglePlace[]) || []
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
