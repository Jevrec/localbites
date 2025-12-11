import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

// Pridobi zgodovino obiskov
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ visited: [] });
    }

    const visited = await sanity.fetch(
      `*[_type == "visitedRestaurant" && user._ref == $userId] | order(visitedAt desc)[0...20] {
        _id,
        placeId,
        name,
        address,
        visitedAt
      }`,
      { userId: session.user.id }
    );

    return NextResponse.json({ visited });
  } catch (err) {
    console.error("Error fetching visited:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Shrani obisk
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false });
    }

    const { placeId, name, address } = await req.json();

    await sanity.create({
      _type: "visitedRestaurant",
      user: {
        _type: "reference",
        _ref: session.user.id,
      },
      placeId,
      name,
      address,
      visitedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving visited:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}