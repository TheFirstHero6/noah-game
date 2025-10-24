import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { MAX_BUILDINGS_PER_CITY } from "@/app/lib/game-config";

const BUILDING_INDEX = [
  {
    name: "Sawmill",
    rarity: "Common",
    cost: { currency: 100, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Quarry",
    rarity: "Common",
    cost: { currency: 100, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Forge",
    rarity: "Common",
    cost: {
      currency: 150,
      wood: 50,
      stone: 0,
      metal: 0,
      food: 0,
      livestock: 0,
    },
  },
  {
    name: "Farm",
    rarity: "Common",
    cost: { currency: 80, wood: 20, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Market",
    rarity: "Rare",
    cost: {
      currency: 200,
      wood: 100,
      stone: 50,
      metal: 0,
      food: 0,
      livestock: 0,
    },
  },
];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      include: { resources: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const { name, rarity } = await request.json();

    // Find the building template
    const buildingTemplate = BUILDING_INDEX.find(
      (b) => b.name === name && b.rarity === rarity
    );
    if (!buildingTemplate) {
      return NextResponse.json(
        { error: "Building template not found" },
        { status: 400 }
      );
    }

    // Check if user owns the city and get current building count
    const city = await prisma.city.findFirst({
      where: {
        id: params.id,
        ownerId: user.id,
      },
      include: {
        buildings: true,
      },
    });

    if (!city) {
      return new Response("City not found", { status: 404 });
    }

    // Check building limits - all cities can have exactly 4 buildings
    const currentBuildingCount = city.buildings.length;

    if (currentBuildingCount >= MAX_BUILDINGS_PER_CITY) {
      return NextResponse.json(
        {
          error: `City has reached its maximum capacity of ${MAX_BUILDINGS_PER_CITY} buildings. All cities can have exactly 4 buildings.`,
        },
        { status: 400 }
      );
    }

    // Check if user has enough resources
    const resources = user.resources;
    if (!resources) {
      return NextResponse.json(
        { error: "User has no resources" },
        { status: 400 }
      );
    }

    const cost = buildingTemplate.cost;
    if (
      resources.currency < cost.currency ||
      resources.wood < cost.wood ||
      resources.stone < cost.stone ||
      resources.metal < cost.metal ||
      resources.food < cost.food ||
      resources.livestock < cost.livestock
    ) {
      return NextResponse.json(
        { error: `You lack the resources to build a ${name}.` },
        { status: 400 }
      );
    }

    // Execute the transaction
    await prisma.$transaction(async (tx) => {
      // Deduct resources
      await tx.resource.update({
        where: { userId: user.id },
        data: {
          currency: { decrement: cost.currency },
          wood: { decrement: cost.wood },
          stone: { decrement: cost.stone },
          metal: { decrement: cost.metal },
          food: { decrement: cost.food },
          livestock: { decrement: cost.livestock },
        },
      });

      // Create the building
      await tx.building.create({
        data: {
          name: buildingTemplate.name,
          rarity: buildingTemplate.rarity,
          cityId: city.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${name} successfully built in ${city.name}!`,
    });
  } catch (error) {
    console.error("Error building structure:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
