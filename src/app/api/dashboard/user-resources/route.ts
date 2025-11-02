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

    if (!adminUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the target user ID and realmId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const realmId = searchParams.get("realmId");

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

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify target user is a member of this realm
    const targetMembership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: targetUser.id,
        },
      },
    });

    // Also check if target user is the owner
    const isOwner = realm.ownerId === targetUser.id;

    if (!isOwner && !targetMembership) {
      return NextResponse.json(
        { error: "Target user is not a member of this realm" },
        { status: 400 }
      );
    }

    // Get user's resources in this realm
    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: targetUser.id,
        },
      },
    });

    // Return the user's resources (default to 0 if no resources exist, handle null values)
    const resources = userResource
      ? {
          wood: userResource.wood || 0,
          stone: userResource.stone || 0,
          food: userResource.food || 0,
          currency: userResource.currency || 0.0,
          metal: userResource.metal || 0,
          livestock: userResource.livestock || 0,
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
