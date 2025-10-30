import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { UNIT_COSTS, POPULATION_UNIT_CAP_BY_TIER } from "@/app/lib/game-config";
import { NextResponse } from "next/server";

function sumResources(items: Array<Partial<Record<keyof typeof UNIT_COSTS[keyof typeof UNIT_COSTS], number>>>) {
  const totals: any = { currency: 0, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 };
  for (const item of items) {
    for (const key of Object.keys(totals)) {
      totals[key] += (item as any)[key] || 0;
    }
  }
  return totals;
}

export async function POST(
  request: Request,
  { params }: { params: { armyId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id }, include: { cities: true, resources: true } });
    if (!user || !user.resources) return new Response("Forbidden", { status: 403 });

    const { unitType, quantity } = await request.json();
    if (!unitType || typeof unitType !== "string" || !Number.isInteger(quantity) || quantity <= 0) {
      return new Response("Invalid payload", { status: 400 });
    }
    const costPer = (UNIT_COSTS as any)[unitType];
    if (!costPer) return new Response("Unknown unit type", { status: 400 });

    // Ownership check
    const army = await prisma.army.findUnique({ where: { id: params.armyId } });
    if (!army || army.ownerId !== user.id) return new Response("Not Found", { status: 404 });

    // Population cap check
    const cap = user.cities.reduce((acc, c) => {
      const capForTier = (POPULATION_UNIT_CAP_BY_TIER as any)[c.upgradeTier] || 0;
      return acc + capForTier;
    }, 0);
    const currentUnits = await prisma.armyUnit.aggregate({
      _sum: { quantity: true },
      where: { army: { ownerId: user.id } },
    });
    const totalUnits = currentUnits._sum.quantity || 0;
    if (totalUnits + quantity > cap) {
      return new Response("Population cap exceeded", { status: 400 });
    }

    // Resource check
    const totalCost = Object.fromEntries(
      Object.entries(costPer).map(([k, v]) => [k, (v as number) * quantity])
    ) as any;
    const r = user.resources;
    if (
      r.currency < totalCost.currency ||
      r.wood < totalCost.wood ||
      r.stone < totalCost.stone ||
      r.metal < totalCost.metal ||
      r.food < totalCost.food ||
      r.livestock < totalCost.livestock
    ) {
      return new Response("Insufficient resources", { status: 400 });
    }

    // Apply changes transactionally
    const result = await prisma.$transaction(async (tx) => {
      // Upsert army unit type
      const existing = await tx.armyUnit.findFirst({ where: { armyId: army.id, unitType } });
      const unitRow = existing
        ? await tx.armyUnit.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
        : await tx.armyUnit.create({ data: { armyId: army.id, unitType, quantity } });

      await tx.resource.update({
        where: { userId: user.id },
        data: {
          currency: r.currency - totalCost.currency,
          wood: r.wood - totalCost.wood,
          stone: r.stone - totalCost.stone,
          metal: r.metal - totalCost.metal,
          food: r.food - totalCost.food,
          livestock: r.livestock - totalCost.livestock,
        },
      });

      return unitRow;
    });

    return NextResponse.json({ success: true, unit: result });
  } catch (error) {
    console.error("Error adding units", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// DELETE: remove units of a type from an army (no refunds)
export async function DELETE(
  request: Request,
  { params }: { params: { armyId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });

    const { unitType, quantity } = await request.json();
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) {
      return new Response("Invalid payload", { status: 400 });
    }

    const army = await prisma.army.findUnique({ where: { id: params.armyId } });
    if (!army || army.ownerId !== user.id) return new Response("Not Found", { status: 404 });

    const existing = await prisma.armyUnit.findFirst({ where: { armyId: army.id, unitType } });
    if (!existing) return new Response("Not Found", { status: 404 });
    const newQty = Math.max(0, existing.quantity - quantity);
    if (newQty === 0) {
      await prisma.armyUnit.delete({ where: { id: existing.id } });
    } else {
      await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: newQty } });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error removing units", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

