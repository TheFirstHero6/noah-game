import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import {
  BUILDING_PRODUCTION_RATES,
  CITY_TIER_INCOME,
  PER_UNIT_UPKEEP,
} from "@/app/lib/game-config";

export async function POST() {
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

    // Get all users with their resources and cities
    const users = await prisma.user.findMany({
      include: {
        resources: true,
        cities: {
          include: {
            buildings: true,
          },
        },
      },
    });

    // Process each user
    for (const user of users) {
      if (!user.resources) {
        console.warn(`User ${user.id} has no resource record. Skipping.`);
        continue;
      }

      // A. Resource Generation from Buildings
      const resourceGains = {
        food: 0,
        wood: 0,
        stone: 0,
        metal: 0,
        livestock: 0,
        currency: 0,
      };

      // Iterate through all cities owned by this user
      for (const city of user.cities) {
        // Iterate through all buildings in each city
        for (const building of city.buildings) {
          // Look up building production rates by tier
          const buildingProduction =
            BUILDING_PRODUCTION_RATES[
              building.name as keyof typeof BUILDING_PRODUCTION_RATES
            ];
          if (buildingProduction) {
            const production =
              buildingProduction[
                building.tier as keyof typeof buildingProduction
              ] || buildingProduction[1]; // Default to tier 1
            if (production) {
              resourceGains.food += production.food || 0;
              resourceGains.wood += production.wood || 0;
              resourceGains.stone += production.stone || 0;
              resourceGains.metal += production.metal || 0;
              resourceGains.livestock += production.livestock || 0;
              resourceGains.currency += production.currency || 0;
            }
          }
        }

        // B. Income & Tax Calculation (New Logic)
        // Calculate Local Trade income based on City Upgrade Tier
        const localTradeGain =
          CITY_TIER_INCOME[city.upgradeTier as keyof typeof CITY_TIER_INCOME] ||
          0;

        // First, add the income to city's total wealth
        const cityWealthAfterIncome = city.localWealth + localTradeGain;

        // Calculate tax amount (portion player takes from total city wealth)
        const taxAmount = (city.taxRate / 100) * cityWealthAfterIncome;

        // Add tax to player currency
        resourceGains.currency += taxAmount;

        // Calculate final city wealth after tax deduction
        const finalCityWealth = cityWealthAfterIncome - taxAmount;

        // Update city's local wealth
        await prisma.city.update({
          where: { id: city.id },
          data: { localWealth: finalCityWealth },
        });
      }

      // C. Upkeep costs for units (per unit per turn)
      const unitSum = await prisma.armyUnit.aggregate({
        _sum: { quantity: true },
        where: { army: { ownerId: user.id } },
      });
      const totalUnits = unitSum._sum.quantity || 0;
      const upkeepFood = (PER_UNIT_UPKEEP.food || 0) * totalUnits;

      // Update user's resources with gains minus upkeep
      await prisma.resource.update({
        where: { userId: user.id },
        data: {
          food: { increment: resourceGains.food - upkeepFood },
          wood: { increment: resourceGains.wood },
          stone: { increment: resourceGains.stone },
          metal: { increment: resourceGains.metal },
          livestock: { increment: resourceGains.livestock },
          currency: { increment: resourceGains.currency },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Turn advanced successfully. Processed ${users.length} users and their cities.`,
    });
  } catch (error) {
    console.error("Error advancing turn:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
