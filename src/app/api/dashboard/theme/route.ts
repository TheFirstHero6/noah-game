import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET - Load user's theme preference
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      select: { theme: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ theme: dbUser.theme || "royal-court" });
  } catch (error) {
    console.error("Error fetching user theme:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Save user's theme preference
export async function POST(req: Request) {
  try {
    console.log("Theme API: Starting POST request");

    const user = await currentUser();
    console.log("Theme API: User found:", !!user);

    if (!user) {
      console.log("Theme API: No user found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Theme API: Request body:", body);

    const { theme } = body;

    // Validate theme
    const validThemes = [
      "royal-court",
      "forest-kingdom",
      "mystical-wizard",
      "dragons-lair",
    ];

    console.log("Theme API: Validating theme:", theme);
    console.log("Theme API: Valid themes:", validThemes);
    console.log("Theme API: Theme is valid:", validThemes.includes(theme));

    if (!validThemes.includes(theme)) {
      console.log("Theme API: Invalid theme, returning 400");
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    console.log("Theme API: Updating user theme in database");

    // First, check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!existingUser) {
      console.log("Theme API: User not found in database");
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const result = await prisma.user.update({
      where: { clerkUserId: user.id },
      data: { theme },
    });

    console.log("Theme API: Database update result:", result);

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("Theme API: Error saving user theme:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
