import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";

async function requireAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { error: new Response("Unauthorized", { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
  if (!user || user.role !== "ADMIN") return { error: new Response("Forbidden", { status: 403 }) };
  return { admin: user } as const;
}

// POST: add units bypassing resource/cap { unitType, quantity }
export async function POST(request: Request, { params }: { params: { armyId: string } }) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { unitType, quantity } = await request.json();
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) return new Response("Invalid payload", { status: 400 });
    const existing = await prisma.armyUnit.findFirst({ where: { armyId: params.armyId, unitType } });
    const unit = existing
      ? await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } })
      : await prisma.armyUnit.create({ data: { armyId: params.armyId, unitType, quantity } });
    return new Response(JSON.stringify({ success: true, unit }), { status: 200 });
  } catch (error) {
    console.error("Admin add units error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// DELETE: remove units bypassing checks { unitType, quantity }
export async function DELETE(request: Request, { params }: { params: { armyId: string } }) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { unitType, quantity } = await request.json();
    if (!unitType || !Number.isInteger(quantity) || quantity <= 0) return new Response("Invalid payload", { status: 400 });
    const existing = await prisma.armyUnit.findFirst({ where: { armyId: params.armyId, unitType } });
    if (!existing) return new Response("Not Found", { status: 404 });
    const newQty = Math.max(0, existing.quantity - quantity);
    if (newQty === 0) {
      await prisma.armyUnit.delete({ where: { id: existing.id } });
    } else {
      await prisma.armyUnit.update({ where: { id: existing.id }, data: { quantity: newQty } });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Admin remove units error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

