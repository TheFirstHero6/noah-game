// app/api/dashboard/roles/route.ts
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get the authenticated user from Clerk
    const userId = await currentUser();

    // If no user is authenticated, return 401
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user in our database using their Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId.id },
    });
    
    // If user doesn't exist in our database, return 404
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get realmId from query parameters
    const { searchParams } = new URL(request.url);
    const realmId = searchParams.get("realmId");

    if (!realmId) {
      return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    }

    // Get user's role in this realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
    });

    if (!realm) {
      return NextResponse.json({ error: "Realm not found or access denied" }, { status: 403 });
    }

    // Determine role: OWNER if owner, otherwise check membership
    const membership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    const role = realm.ownerId === user.id ? "OWNER" : (membership?.role || "BASIC");

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching user role:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
