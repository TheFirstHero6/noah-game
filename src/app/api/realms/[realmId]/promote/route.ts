import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// POST: Promote a member to admin (owner/admin only)
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
        { error: "Only realm owners and admins can promote members" },
        { status: 403 }
      );
    }

    // Can't promote the owner (they're already the owner)
    if (targetUserId === realm.ownerId) {
      return NextResponse.json(
        { error: "The realm owner is already the owner and cannot be promoted" },
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

    // Check if user is already an admin
    if (targetMembership.role === "ADMIN") {
      return NextResponse.json(
        { error: "User is already an admin" },
        { status: 400 }
      );
    }

    // Get target user info for response
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { name: true },
    });

    // Update membership to ADMIN
    await prisma.realmMember.update({
      where: {
        id: targetMembership.id,
      },
      data: {
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Promoted ${targetUser?.name || "player"} to admin successfully`,
    });
  } catch (error) {
    console.error("Error promoting member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

