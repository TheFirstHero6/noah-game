import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    // Parse JSON body
    const { targetUserId, wood, stone, food, ducats } = await req.json();

    // Validate input
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    // Validate resource values (must be non-negative integers)
    const resourceValues = { wood, stone, food, ducats };
    for (const [resource, value] of Object.entries(resourceValues)) {
      if (value !== undefined && (value < 0 || !Number.isInteger(value))) {
        return NextResponse.json(
          { error: `${resource} must be a non-negative integer` },
          { status: 400 }
        );
      }
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { resources: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Prepare update data - only update resources that are provided
    const updateData: any = {};
    if (wood !== undefined) updateData.wood = wood;
    if (stone !== undefined) updateData.stone = stone;
    if (food !== undefined) updateData.food = food;
    if (ducats !== undefined) updateData.ducats = ducats;

    // If no resources are provided, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "At least one resource value must be provided" },
        { status: 400 }
      );
    }

    // Execute the update
    let updatedResources;
    if (targetUser.resources) {
      // Update existing resources
      updatedResources = await prisma.resource.update({
        where: { userId: targetUser.id },
        data: updateData,
      });
    } else {
      // Create new resources record
      updatedResources = await prisma.resource.create({
        data: {
          userId: targetUser.id,
          ...updateData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${targetUser.name}'s resources`,
      resources: updatedResources,
    });
  } catch (error) {
    console.error("Admin resource management error:", error);
    return NextResponse.json(
      {
        error: "Failed to update resources. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
