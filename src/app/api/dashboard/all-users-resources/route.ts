import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    // Get realmId from query parameters
    const { searchParams } = new URL(request.url);
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
          { members: { some: { userId: adminUser.id, role: { in: ["OWNER", "ADMIN"] } } } },
        ],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or you don't have admin access to this realm" },
        { status: 403 }
      );
    }

    // Get all users who are members of this realm
    const realmMembers = await prisma.realmMember.findMany({
      where: { realmId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            role: true,
          },
        },
      },
    });

    // Also get the owner
    const owner = await prisma.user.findUnique({
      where: { id: realm.ownerId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        role: true,
      },
    });

    // Combine owner and members
    const allRealmUsers = [
      ...(owner ? [owner] : []),
      ...realmMembers.map((rm) => rm.user).filter((u) => u.id !== realm.ownerId),
    ];

    // Get resources for each user in this realm
    const usersWithResources = await Promise.all(
      allRealmUsers.map(async (user) => {
        const resource = await prisma.resource.findUnique({
          where: {
            realmId_userId: {
              realmId,
              userId: user.id,
            },
          },
        });

        return {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
          role: user.role,
          resources: resource
            ? {
                wood: resource.wood || 0,
                stone: resource.stone || 0,
                food: resource.food || 0,
                currency: resource.currency || 0.0,
                metal: resource.metal || 0,
                livestock: resource.livestock || 0,
              }
            : {
                wood: 0,
                stone: 0,
                food: 0,
                currency: 0.0,
                metal: 0,
                livestock: 0,
              },
        };
      })
    );

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
