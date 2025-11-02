import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    if (!adminUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse JSON body
    const { targetUserId, realmId, wood, stone, food, currency, metal, livestock } =
      await req.json();

    // Validate input
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    if (!realmId) {
      return NextResponse.json(
        { error: "realmId is required" },
        { status: 400 }
      );
    }

    // Verify realm exists and user is admin/owner of this realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [
          { ownerId: adminUser.id },
          { members: { some: { userId: adminUser.id, role: "ADMIN" } } },
        ],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or you don't have admin access to this realm" },
        { status: 403 }
      );
    }

    // Validate resource values (must be non-negative numbers, currency can be float)
    const resourceValues = { wood, stone, food, currency, metal, livestock };
    for (const [resource, value] of Object.entries(resourceValues)) {
      if (value !== undefined && value < 0) {
        return NextResponse.json(
          { error: `${resource} must be a non-negative number` },
          { status: 400 }
        );
      }
      // For non-currency resources, ensure they are integers
      if (
        value !== undefined &&
        resource !== "currency" &&
        !Number.isInteger(value)
      ) {
        return NextResponse.json(
          { error: `${resource} must be a whole number` },
          { status: 400 }
        );
      }
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Verify target user is a member of this realm
    const targetMembership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: targetUserId,
        },
      },
    });

    const isOwner = realm.ownerId === targetUserId;
    if (!isOwner && !targetMembership) {
      return NextResponse.json(
        { error: "Target user is not a member of this realm" },
        { status: 400 }
      );
    }

    // Get or create target user's resources in this realm
    let targetResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: targetUserId,
        },
      },
    });

    if (!targetResource) {
      // Create resources if they don't exist
      targetResource = await prisma.resource.create({
        data: {
          userId: targetUserId,
          realmId,
          wood: 0,
          stone: 0,
          food: 0,
          currency: 0,
          metal: 0,
          livestock: 0,
        },
      });
    }

    // Prepare update data - only update resources that are provided
    const updateData: any = {};
    if (wood !== undefined) updateData.wood = wood;
    if (stone !== undefined) updateData.stone = stone;
    if (food !== undefined) updateData.food = food;
    if (currency !== undefined) updateData.currency = currency;
    if (metal !== undefined) updateData.metal = metal;
    if (livestock !== undefined) updateData.livestock = livestock;

    // If no resources are provided, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "At least one resource value must be provided" },
        { status: 400 }
      );
    }

    // Execute the update
    const updatedResources = await prisma.resource.update({
      where: { 
        realmId_userId: {
          realmId,
          userId: targetUserId,
        },
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${targetUser.name}'s resources in ${realm.name}`,
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
