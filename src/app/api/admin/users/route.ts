import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
          { ownerId: user.id },
          { members: { some: { userId: user.id, role: { in: ["ADMIN", "OWNER"] } } } },
        ],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or you don't have admin access to this realm" },
        { status: 403 }
      );
    }

    // Get all users who are members of this realm with their roles
    const realmMembers = await prisma.realmMember.findMany({
      where: { realmId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
        email: true,
      },
    });

    // Combine owner and members with their realm roles
    const users = [];
    if (owner) {
      users.push({ ...owner, role: "OWNER" });
    }
    realmMembers.forEach((member) => {
      if (member.user.id !== realm.ownerId) {
        users.push({ ...member.user, role: member.role });
      }
    });

    return NextResponse.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
