import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// POST: Kick a player from a realm (admin/owner only)
export async function POST(
  request: Request,
  context: { params: Promise<{ realmId: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { realmId } = await context.params;
    const { userId: targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the realm and check if user is admin/owner
    const realm = await prisma.realm.findUnique({
      where: { id: realmId },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found" },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    const isOwner = realm.ownerId === user.id;
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    const isAdmin = membership?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Only realm owners and admins can kick players" },
        { status: 403 }
      );
    }

    // Can't kick the owner
    if (targetUserId === realm.ownerId) {
      return NextResponse.json(
        { error: "Cannot kick the realm owner" },
        { status: 400 }
      );
    }

    // Can't kick yourself
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: "You cannot kick yourself. Use the Leave button instead." },
        { status: 400 }
      );
    }

    // Check if target user is a member
    const targetMembership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: targetUserId,
        },
      },
    });

    if (!targetMembership) {
      return NextResponse.json(
        { error: "User is not a member of this realm" },
        { status: 400 }
      );
    }

    // Get target user info for response
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { name: true },
    });

    // Remove membership and all associated data
    await prisma.$transaction(async (tx) => {
      // Delete membership
      await tx.realmMember.delete({
        where: {
          id: targetMembership.id,
        },
      });

      // Delete user's resources in this realm
      await tx.resource.deleteMany({
        where: {
          userId: targetUserId,
          realmId,
        },
      });

      // Delete user's cities in this realm
      await tx.city.deleteMany({
        where: {
          ownerId: targetUserId,
          realmId,
        },
      });

      // Delete user's armies in this realm
      await tx.army.deleteMany({
        where: {
          ownerId: targetUserId,
          realmId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Kicked ${targetUser?.name || "player"} from realm successfully`,
    });
  } catch (error) {
    console.error("Error kicking player:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

