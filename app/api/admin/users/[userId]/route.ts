import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanity } from "@/sanity/lib/sanity";

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

export async function PATCH(
  req: Request,
  context: RouteContext
) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const { userId } = await context.params;
    const { role, username } = await req.json();

    console.log("Updating user:", userId, { role, username });

    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    
    const result = await sanity
      .patch(userId)
      .set({
        ...(role && { role }),
        ...(username && { username }),
      })
      .commit();

    console.log("Update result:", result);

    return NextResponse.json({ success: true, user: result });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { 
        error: "Server error", 
        details: err instanceof Error ? err.message : String(err) 
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: RouteContext
) {
  try {
    const session = await auth();
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;

    console.log("Deleting user:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await sanity.delete(userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { 
        error: "Server error",
        details: err instanceof Error ? err.message : String(err)
      }, 
      { status: 500 }
    );
  }
}