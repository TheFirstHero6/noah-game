import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();

    // If no user is authenticated, return 401
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the admin user in our database
    const adminUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    // Check if user exists and has ADMIN role
    if (!adminUser || adminUser.role !== "ADMIN") {
      return new NextResponse("Forbidden - Admin access required", {
        status: 403,
      });
    }

    // Get all users with their resources
    const allUsers = await prisma.user.findMany({
      include: {
        resources: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Format the data for the frontend
    const usersWithResources = allUsers.map((user) => ({
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
      role: user.role,
      resources: user.resources
        ? {
            wood: user.resources.wood || 0,
            stone: user.resources.stone || 0,
            food: user.resources.food || 0,
            currency: user.resources.currency || 0.0,
            metal: user.resources.metal || 0,
            livestock: user.resources.livestock || 0,
          }
        : {
            wood: 0,
            stone: 0,
            food: 0,
            currency: 0.0,
            metal: 0,
            livestock: 0,
          },
    }));

    return NextResponse.json({
      success: true,
      users: usersWithResources,
    });
  } catch (error) {
    console.error("Error fetching all users with resources:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users with resources. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
