import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET: Get realm details
export async function GET(
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

    // Check if user is a member of this realm
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    // Check if user owns this realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
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
        { error: "Realm not found or access denied" },
        { status: 404 }
      );
    }

    const memberRole =
      realm.ownerId === user.id
        ? "OWNER"
        : membership?.role || "BASIC";

    return NextResponse.json({
      success: true,
      realm: {
        ...realm,
        memberRole,
      },
    });
  } catch (error) {
    console.error("Error fetching realm:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

