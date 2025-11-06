import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// POST: Join a realm by code
export async function POST(request: Request) {
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

    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Join code is required" },
        { status: 400 }
      );
    }

    // Find realm by code
    const realm = await prisma.realm.findUnique({
      where: { code: code.toUpperCase().trim() },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Invalid join code" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId: realm.id,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this realm" },
        { status: 400 }
      );
    }

    // Add user as member and create initial resources
    await prisma.$transaction(async (tx) => {
      // Add user as member
      await tx.realmMember.create({
        data: {
          realmId: realm.id,
          userId: user.id,
          role: "BASIC",
        },
      });

      // Create initial resources for user in this realm
      await tx.resource.create({
        data: {
          userId: user.id,
          realmId: realm.id,
          wood: 0,
          stone: 0,
          food: 0,
          currency: 0,
          metal: 0,
          livestock: 0,
        },
      });
    });

    // Fetch updated realm with new member
    const updatedRealm = await prisma.realm.findUnique({
      where: { id: realm.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      realm: {
        ...updatedRealm,
        memberRole: "BASIC",
      },
    });
  } catch (error) {
    console.error("Error joining realm:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

