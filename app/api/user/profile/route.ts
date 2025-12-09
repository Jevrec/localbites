import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await sanity.fetch(
      `*[_type == "user" && _id == $id][0]{
        _id,
        email,
        username,
        "profileImage": profileImage.asset->url
      }`,
      { id: session.user.id }
    );

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}