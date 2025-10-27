import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user || user.role !== "ADMIN") {
      return new Response("Forbidden", { status: 403 });
    }

    const cities = await prisma.city.findMany({
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
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user || user.role !== "ADMIN") {
      return new Response("Forbidden", { status: 403 });
    }

    const { userId, name, tier } = await request.json();

    if (!userId || !name?.trim()) {
      return NextResponse.json(
        { error: "User ID and city name are required" },
        { status: 400 }
      );
    }

    // Validate tier (1-5)
    const cityTier = tier && tier >= 1 && tier <= 5 ? tier : 1;

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the city with specified tier and initial local wealth
    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        ownerId: userId,
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
    return new Response("Internal Server Error", { status: 500 });
  }
}
