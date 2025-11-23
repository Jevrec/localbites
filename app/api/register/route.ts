import { NextResponse } from "next/server";
import { sanity } from "@/sanity/lib/sanity";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const existing = await sanity.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await sanity.create({
      _type: "user",
      email,
      username,
      password: hashed
    });

    return NextResponse.json({ user });
  } catch (err) {
   
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}