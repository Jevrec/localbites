import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const town = searchParams.get("town");

  if (!town) {
    return NextResponse.json({ error: "Missing town parameter" }, { status: 400 });
  }

  try {
    // 1️⃣ Get coordinates for the town
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(town)}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return NextResponse.json({ restaurants: [] });
    }

    const { lat, lon } = geoData[0];

    // 2️⃣ Query Overpass API for restaurants
    const overpassQuery = `
      [out:json][timeout:25];
      node["amenity"="restaurant"](around:5000,${lat},${lon});
      out body;
    `;

    const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
    });

    const overpassData = await overpassRes.json();

    // 3️⃣ Format results
    const restaurants = overpassData.elements.map((el: any) => ({
      id: el.id,
      name: el.tags?.name,
      address: el.tags?.["addr:street"]
        ? `${el.tags["addr:street"]}, ${el.tags["addr:city"] || town}`
        : el.tags?.["addr:city"] || town,
      lat: el.lat,
      lon: el.lon,
    }));

    return NextResponse.json({ restaurants });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}
