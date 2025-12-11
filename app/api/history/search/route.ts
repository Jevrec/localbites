import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

// Pridobi zgodovino iskanj
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ searches: [] });
    }

    const searches = await sanity.fetch(
      `*[_type == "searchHistory" && user._ref == $userId] | order(searchedAt desc)[0...10] {
        _id,
        city,
        searchedAt
      }`,
      { userId: session.user.id }
    );

    // Odstrani duplikate, obdrži samo najnovejše
    const uniqueSearches = searches.reduce((acc: any[], curr: any) => {
      if (!acc.find((s: any) => s.city.toLowerCase() === curr.city.toLowerCase())) {
        acc.push(curr);
      }
      return acc;
    }, []);

    return NextResponse.json({ searches: uniqueSearches.slice(0, 5) });
  } catch (err) {
    console.error("Error fetching search history:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Shrani iskanje
export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { city } = await req.json();

    if (!city) {
      return NextResponse.json({ error: "City required" }, { status: 400 });
    }

    await sanity.create({
      _type: "searchHistory",
      user: {
        _type: "reference",
        _ref: session.user.id,
      },
      city,
      searchedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving search:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Izbriši zgodovino
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchId } = await req.json();

    if (searchId) {
      // Izbriši en vnos
      await sanity.delete(searchId);
    } else {
      // Izbriši vse vnose uporabnika
      const searches = await sanity.fetch(
        `*[_type == "searchHistory" && user._ref == $userId]._id`,
        { userId: session.user.id }
      );

      for (const id of searches) {
        await sanity.delete(id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting search history:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}