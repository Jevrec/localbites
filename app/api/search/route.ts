import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { city, radius = 5000, maxResults = 20 } = await req.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${apiKey}`
    );

    const geoData = await geoRes.json();
    console.log("Geocode result:", geoData);

    if (!geoData.results.length) {
      console.log("No geocode results");
      return NextResponse.json({ restaurants: [] });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}`
    );

    const placesData = await placesRes.json();
    console.log("Places result:", placesData);
    
    const limitedResults = placesData.results?.slice(0, maxResults) || [];

    return NextResponse.json({ restaurants: limitedResults });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}