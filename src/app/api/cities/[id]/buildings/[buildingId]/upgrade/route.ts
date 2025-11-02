import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { BUILDING_UPGRADE_COSTS } from "@/app/lib/game-config";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string; buildingId: string }> }
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

    // Find the building and verify ownership
    const { id, buildingId } = await context.params;
    const building = await prisma.building.findFirst({
      where: {
        id: buildingId,
        city: {
          id,
          ownerId: user.id,
        },
      },
      include: {
        city: true,
      },
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }
    
    if (!building.city.realmId) {
      return NextResponse.json(
        { error: "City is not in a realm" },
        { status: 400 }
      );
    }
    
    // Get user's resources in this realm
    const userResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId: building.city.realmId,
          userId: user.id,
        },
      },
    });
    
    if (!userResource) {
      return NextResponse.json(
        { error: "User has no resources in this realm" },
        { status: 400 }
      );
    }
    
    const resources = userResource;

    // Check if building can be upgraded (max tier 3)
    if (building.tier >= 3) {
      return NextResponse.json(
        { error: "Building is already at maximum tier (3)" },
        { status: 400 }
      );
    }

    // Get upgrade cost for next tier
    const nextTier = building.tier + 1;
    const upgradeCost =
      BUILDING_UPGRADE_COSTS[nextTier as keyof typeof BUILDING_UPGRADE_COSTS];

    if (!upgradeCost) {
      return NextResponse.json(
        { error: "Invalid upgrade tier" },
        { status: 400 }
      );
    }

    // Check if user has enough resources
    if (
      resources.currency < upgradeCost.currency ||
      resources.wood < upgradeCost.wood ||
      resources.stone < upgradeCost.stone ||
      resources.metal < upgradeCost.metal ||
      resources.food < upgradeCost.food ||
      resources.livestock < upgradeCost.livestock
    ) {
      return NextResponse.json(
        {
          error: `You lack the resources to upgrade this building to tier ${nextTier}. Required: ${upgradeCost.currency} currency, ${upgradeCost.wood} wood, ${upgradeCost.stone} stone, ${upgradeCost.metal} metal, ${upgradeCost.food} food, ${upgradeCost.livestock} livestock.`,
        },
        { status: 400 }
      );
    }

    // Execute the transaction
    await prisma.$transaction(async (tx) => {
      // Deduct resources (using composite unique key)
      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId: building.city.realmId,
            userId: user.id,
          },
        },
        data: {
          currency: { decrement: upgradeCost.currency },
          wood: { decrement: upgradeCost.wood },
          stone: { decrement: upgradeCost.stone },
          metal: { decrement: upgradeCost.metal },
          food: { decrement: upgradeCost.food },
          livestock: { decrement: upgradeCost.livestock },
        },
      });

      // Upgrade the building
      await tx.building.update({
        where: { id: building.id },
        data: { tier: nextTier },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${building.name} has been upgraded to tier ${nextTier}!`,
    });
  } catch (error) {
    console.error("Error upgrading building:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
