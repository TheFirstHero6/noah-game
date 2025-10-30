import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { error: new Response("Unauthorized", { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
  if (!user || user.role !== "ADMIN") return { error: new Response("Forbidden", { status: 403 }) };
  return { admin: user } as const;
}

// POST: add units bypassing resource/cap { unitType, quantity }
export async function POST(request: Request, context: { params: Promise<{ armyId: string }> }) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { armyId } = await context.params;
    if (!armyId || typeof armyId !== "string") {
      return NextResponse.json({ error: "Missing armyId in route" }, { status: 400 });
    }
    const { unitType, quantity } = await request.json();
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const existing = await prisma.armyUnit.findFirst({ where: { armyId, unitType } });
    const unit = existing
      ? await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
      : await prisma.armyUnit.create({ data: { armyId, unitType, quantity } });
    return new Response(JSON.stringify({ success: true, unit }), { status: 200 });
  } catch (error: any) {
    console.error("Admin add units error", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: remove units bypassing checks { unitType, quantity }
export async function DELETE(request: Request, context: { params: Promise<{ armyId: string }> }) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { armyId } = await context.params;
    if (!armyId || typeof armyId !== "string") {
      return NextResponse.json({ error: "Missing armyId in route" }, { status: 400 });
    }
    const { unitType, quantity } = await request.json();
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const existing = await prisma.armyUnit.findFirst({ where: { armyId, unitType } });
    if (!existing) return new Response("Not Found", { status: 404 });
    const newQty = Math.max(0, existing.quantity - quantity);
    if (newQty === 0) {
      await prisma.armyUnit.delete({ where: { id: existing.id } });
    } else {
      await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: newQty } });
    }
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("Admin remove units error", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

