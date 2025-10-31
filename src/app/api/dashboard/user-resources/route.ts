import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();

    // If no user is authenticated, return 401
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the admin user in our database
    const adminUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    // Check if user exists and has ADMIN role
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get the target user ID from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the target user and their resources
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { resources: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user's resources (default to 0 if no resources exist, handle null values)
    const resources = targetUser.resources
      ? {
          wood: targetUser.resources.wood || 0,
          stone: targetUser.resources.stone || 0,
          food: targetUser.resources.food || 0,
          currency: targetUser.resources.currency || 0.0,
          metal: targetUser.resources.metal || 0,
          livestock: targetUser.resources.livestock || 0,
        }
      : {
          wood: 0,
          stone: 0,
          food: 0,
          currency: 0.0,
          metal: 0,
          livestock: 0,
        };

    return NextResponse.json({
      success: true,
      resources: {
        wood: resources.wood,
        stone: resources.stone,
        food: resources.food,
        currency: resources.currency,
        metal: resources.metal,
        livestock: resources.livestock,
      },
    });
  } catch (error) {
    console.error("Error fetching user resources:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user resources. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
