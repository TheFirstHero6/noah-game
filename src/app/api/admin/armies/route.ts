import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

async function requireRealmAdmin(realmId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
  if (!user) return { error: NextResponse.json({ error: "User not found" }, { status: 404 }) };
  
  if (!realmId) {
    return { error: NextResponse.json({ error: "realmId is required" }, { status: 400 }) };
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
    return { error: NextResponse.json({ error: "Realm not found or you don't have admin access to this realm" }, { status: 403 }) };
  }
  
  return { admin: user, realmId } as const;
}

// GET: ?userId=...&realmId=... => list armies with units for that user in this realm
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const realmId = searchParams.get("realmId");
    if (!realmId) return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    
    const gate = await requireRealmAdmin(realmId);
    if ("error" in gate) return gate.error;
    
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const armies = await prisma.army.findMany({
      where: { ownerId: userId, realmId: gate.realmId },
      include: { units: true },
    });
    return NextResponse.json({ success: true, armies });
  } catch (error) {
    console.error("Error admin list armies", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: create army for a user { userId, name, realmId }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, realmId } = body;
    if (!userId || !name) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    if (!realmId) return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    
    const gate = await requireRealmAdmin(realmId);
    if ("error" in gate) return gate.error;
    
    // Verify target user is a member of this realm
    const realm = await prisma.realm.findUnique({
      where: { id: gate.realmId },
    });
    
    if (!realm) {
      return NextResponse.json({ error: "Realm not found" }, { status: 404 });
    }
    
    const isOwner = realm.ownerId === userId;
    const targetMembership = await prisma.realmMember.findUnique({
      where: {
        realmId_userId: {
          realmId: gate.realmId,
          userId,
        },
      },
    });
    
    if (!isOwner && !targetMembership) {
      return NextResponse.json(
        { error: "Target user is not a member of this realm" },
        { status: 400 }
      );
    }
    
    const army = await prisma.army.create({
      data: { ownerId: userId, name, realmId: gate.realmId },
      include: { units: true },
    });
    return NextResponse.json({ success: true, army });
  } catch (error) {
    console.error("Error admin create army", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: delete army ?armyId=...&realmId=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const armyId = searchParams.get("armyId");
    const realmId = searchParams.get("realmId");
    if (!armyId) return NextResponse.json({ error: "Missing armyId" }, { status: 400 });
    if (!realmId) return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    
    const gate = await requireRealmAdmin(realmId);
    if ("error" in gate) return gate.error;
    
    // Verify army belongs to this realm
    const army = await prisma.army.findUnique({
      where: { id: armyId },
    });
    
    if (!army) {
      return NextResponse.json({ error: "Army not found" }, { status: 404 });
    }
    
    if (army.realmId !== gate.realmId) {
      return NextResponse.json(
        { error: "Army does not belong to this realm" },
        { status: 403 }
      );
    }
    
    await prisma.armyUnit.deleteMany({ where: { armyId } });
    await prisma.army.delete({ where: { id: armyId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error admin delete army", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

