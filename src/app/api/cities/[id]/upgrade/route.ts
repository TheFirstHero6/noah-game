import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { CITY_UPGRADE_COSTS } from "@/app/lib/game-config";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { targetTier } = await request.json();

    if (!targetTier || targetTier < 2 || targetTier > 5) {
      return NextResponse.json(
        { error: "Invalid target tier. Must be between 2 and 5." },
        { status: 400 }
      );
    }

    // Get the city
    const { id } = await context.params;
    const city = await prisma.city.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    
    if (!city.realmId) {
      return NextResponse.json(
        { error: "City is not in a realm" },
        { status: 400 }
      );
    }
    
    // Get user's resources in this realm
    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: city.realmId,
          userId: user.id,
        },
      },
    });
    
    if (!userResource) {
      return NextResponse.json(
        { error: "User has no resource record in this realm" },
        { status: 400 }
      );
    }

    // Check if city is already at or above target tier
    if (city.upgradeTier >= targetTier) {
      return NextResponse.json(
        { error: `City is already at tier ${city.upgradeTier} or higher.` },
        { status: 400 }
      );
    }

    // Check if target tier is next in sequence
    if (targetTier !== city.upgradeTier + 1) {
      return NextResponse.json(
        {
          error: `City must be upgraded to tier ${city.upgradeTier + 1} first.`,
        },
        { status: 400 }
      );
    }

    // Get upgrade costs
    const costs =
      CITY_UPGRADE_COSTS[targetTier as keyof typeof CITY_UPGRADE_COSTS];
    if (!costs) {
      return NextResponse.json(
        { error: "Invalid upgrade tier" },
        { status: 400 }
      );
    }

    // Check if user has enough resources
    if (
      userResource.currency < costs.currency ||
      userResource.wood < costs.wood ||
      userResource.stone < costs.stone
    ) {
      return NextResponse.json(
        {
          error: `You do not have the ${costs.currency} currency, ${costs.wood} wood, and ${costs.stone} stone needed to upgrade to Tier ${targetTier}.`,
        },
        { status: 400 }
      );
    }

    // Execute the upgrade transaction
    await prisma.$transaction(async (tx) => {
      // Deduct resources (using composite unique key)
      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: city.realmId,
            userId: user.id,
          },
        },
        data: {
          currency: { decrement: costs.currency },
          wood: { decrement: costs.wood },
          stone: { decrement: costs.stone },
        },
      });

      // Upgrade the city
      await tx.city.update({
        where: { id: city.id },
        data: { upgradeTier: targetTier },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${city.name} has been upgraded to Tier ${targetTier}!`,
    });
  } catch (error) {
    console.error("Error upgrading city:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
