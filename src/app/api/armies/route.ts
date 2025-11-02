import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET: List current user's armies with units
export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });

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

    const armies = await prisma.army.findMany({
      where: {
        ownerId: user.id,
        realmId: realmId,
      },
      include: { units: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, armies });
  } catch (error) {
    console.error("Error fetching armies", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// POST: Create a new empty army { name, realmId }
export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });

    const { name, realmId } = await request.json();
    if (!name || typeof name !== "string") {
      return new Response("Invalid name", { status: 400 });
    }

    if (!realmId || typeof realmId !== "string") {
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

    const army = await prisma.army.create({
      data: { name, ownerId: user.id, realmId: realmId },
      include: { units: true },
    });
    return NextResponse.json({ success: true, army });
  } catch (error) {
    console.error("Error creating army", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

