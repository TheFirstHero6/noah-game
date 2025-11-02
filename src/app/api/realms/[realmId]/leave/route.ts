import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// POST: Leave a realm
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

    // Check if user owns the realm
    const realm = await prisma.realm.findUnique({
      where: { id: realmId },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found" },
        { status: 404 }
      );
    }

    if (realm.ownerId === user.id) {
      return NextResponse.json(
        { error: "Realm owner cannot leave. Transfer ownership or delete the realm first." },
        { status: 400 }
      );
    }

    // Check if user is a member
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this realm" },
        { status: 400 }
      );
    }

    // Remove membership (this will cascade delete resources due to foreign key)
    await prisma.$transaction(async (tx) => {
      // Delete membership
      await tx.realmMember.delete({
        where: {
          id: membership.id,
        },
      });

      // Delete user's resources in this realm
      await tx.resource.deleteMany({
        where: {
          userId: user.id,
          realmId,
        },
      });

      // Delete user's cities in this realm
      await tx.city.deleteMany({
        where: {
          ownerId: user.id,
          realmId,
        },
      });

      // Delete user's armies in this realm
      await tx.army.deleteMany({
        where: {
          ownerId: user.id,
          realmId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Left realm successfully",
    });
  } catch (error) {
    console.error("Error leaving realm:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

