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
          { members: { some: { userId: user.id, role: "ADMIN" } } },
        ],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or you don't have admin access to this realm" },
        { status: 403 }
      );
    }

    // Get all cities in this realm
    const cities = await prisma.city.findMany({
      where: { realmId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      cities: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    const { userId, name, tier, realmId } = await request.json();

    if (!userId || !name?.trim()) {
      return NextResponse.json(
        { error: "User ID and city name are required" },
        { status: 400 }
      );
    }

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
          { members: { some: { userId: user.id, role: "ADMIN" } } },
        ],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or you don't have admin access to this realm" },
        { status: 403 }
      );
    }

    // Validate tier (1-5)
    const cityTier = tier && tier >= 1 && tier <= 5 ? tier : 1;

    // Check if target user exists and is a member of this realm
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify target user is a member or owner of this realm
    const isOwner = realm.ownerId === targetUser.id;
    const targetMembership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: targetUser.id,
        },
      },
    });

    if (!isOwner && !targetMembership) {
      return NextResponse.json(
        { error: "Target user is not a member of this realm" },
        { status: 400 }
      );
    }

    // Create the city with specified tier and initial local wealth
    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        ownerId: userId,
        realmId: realmId,
        upgradeTier: cityTier,
        localWealth: 100, // Initial local wealth as per new rules
        taxRate: 5,
      },
    });

    return NextResponse.json({
      success: true,
      message: `City "${city.name}" (Tier ${cityTier}) granted to ${targetUser.name}`,
      city: city,
    });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
