import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

// Pridobi favorite
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await sanity.fetch(
      `*[_type == "favoriteRestaurant" && user._ref == $userId] | order(savedAt desc) {
        _id,
        placeId,
        name,
        address,
        rating,
        notes,
        savedAt
      }`,
      { userId: session.user.id }
    );

    return NextResponse.json({ favorites });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Dodaj favorite
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { placeId, name, address, rating } = await req.json();

    // Preveri če že obstaja
    const existing = await sanity.fetch(
      `*[_type == "favoriteRestaurant" && user._ref == $userId && placeId == $placeId][0]`,
      { userId: session.user.id, placeId }
    );

    if (existing) {
      return NextResponse.json({ error: "Already in favorites" }, { status: 400 });
    }

    const favorite = await sanity.create({
      _type: "favoriteRestaurant",
      user: {
        _type: "reference",
        _ref: session.user.id,
      },
      placeId,
      name,
      address,
      rating,
      savedAt: new Date().toISOString(),
    });

    return NextResponse.json({ favorite });
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Odstrani favorite
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { favoriteId } = await req.json();

    await sanity.delete(favoriteId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting favorite:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}