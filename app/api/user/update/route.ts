import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username, currentPassword, newPassword } = await req.json();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password required" },
          { status: 400 }
        );
      }

      const user = await sanity.fetch(
        `*[_type == "user" && _id == $id][0]{ password }`,
        { id: session.user.id }
      );

      if (user.password) {
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json(
            { error: "Current password is incorrect" },
            { status: 400 }
          );
        }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await sanity
        .patch(session.user.id)
        .set({
          username: username || undefined,
          password: hashedPassword,
        })
        .commit();
    } else {
      await sanity
        .patch(session.user.id)
        .set({
          username: username || undefined,
        })
        .commit();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}