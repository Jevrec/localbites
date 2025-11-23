import { NextResponse } from "next/server";
import { sanity } from "@/sanity/lib/sanity";
//import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    //const hashed = await bcrypt.hash(password, 10);

    const newUser = await sanity.create({
      _type: "user",
      email,
      username,
      password: password //mora biti hashed - začasno zamenjano,
    });

    return NextResponse.json({ user: newUser });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
