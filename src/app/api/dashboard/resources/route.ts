// app/api/resources/route.ts
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
      return NextResponse.json(
        { error: "realmId is required" },
        { status: 400 }
      );
    }

    // Verify user is a member of this realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or access denied" },
        { status: 403 }
      );
    }

    // Find user's resources in this realm
    let resources = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: user.id,
        },
      },
    });

    // If user has no resources yet in this realm, create them lazily
    if (!resources) {
      try {
        resources = await prisma.resource.create({
          data: {
            userId: user.id,
            realmId: realmId,
            wood: 0,
            stone: 0,
            food: 0,
            currency: 0,
            metal: 0,
            livestock: 0,
          },
        });
      } catch (createError: any) {
        // If we can't create resources (e.g., constraint error), return empty resources
        console.error("Warning: Could not create resources lazily:", createError);
        return NextResponse.json({
          wood: 0,
          stone: 0,
          food: 0,
          currency: 0,
          metal: 0,
          livestock: 0,
        });
      }
    }

    // Return the user's resources in this realm
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
