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

// GET: ?userId=... => list armies with units for that user
export async function GET(request: Request) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return new Response("Missing userId", { status: 400 });
    const armies = await prisma.army.findMany({ where: { ownerId: userId }, include: { units: true } });
    return NextResponse.json({ success: true, armies });
  } catch (error) {
    console.error("Error admin list armies", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// POST: create army for a user { userId, name }
export async function POST(request: Request) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { userId, name } = await request.json();
    if (!userId || !name) return new Response("Invalid payload", { status: 400 });
    const army = await prisma.army.create({ data: { ownerId: userId, name }, include: { units: true } });
    return NextResponse.json({ success: true, army });
  } catch (error) {
    console.error("Error admin create army", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// DELETE: delete army ?armyId=...
export async function DELETE(request: Request) {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const { searchParams } = new URL(request.url);
    const armyId = searchParams.get("armyId");
    if (!armyId) return new Response("Missing armyId", { status: 400 });
    await prisma.armyUnit.deleteMany({ where: { armyId } });
    await prisma.army.delete({ where: { id: armyId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error admin delete army", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

