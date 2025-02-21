// app/api/resources/route.ts
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../lib/db";
import { NextResponse } from "next/server";
import { stat } from "fs";

export async function GET() {
  try {
    // Get the authenticated user from Clerk
    const userId = await currentUser();

    // If no user is authenticated, return 401
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user in our database using their Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId.id },
      include: {
        resources: true,
      },
    });
    // If user doesn't exist in our database, return 404
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // If user has no resources yet, return empty resource object
    if (!user.resources) {
      return NextResponse.json({
        wood: 0,
        stone: 0,
        food: 0,
        ducats: 0,
      });
    }

    // Return the user's resources
    return NextResponse.json(user.resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
