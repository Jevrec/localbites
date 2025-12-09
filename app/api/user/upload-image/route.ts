import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const asset = await sanity.assets.upload('image', buffer, {
      filename: file.name,
    });

    await sanity
      .patch(session.user.id)
      .set({
        profileImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit();

    return NextResponse.json({ 
      success: true,
      imageUrl: asset.url 
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}