import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await sanity.fetch(
      `*[_type == "user"] | order(createdAt desc) {
        _id,
        email,
        username,
        role,
        createdAt,
        "profileImage": profileImage.asset->url
      }`
    );

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}