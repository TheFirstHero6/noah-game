import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { id: true },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const { type, itemID, toUserID, realmId } = await req.json();

  if (!realmId) {
    return new Response("realmId is required", { status: 400 });
  }

  // Verify user is admin/owner of this realm
  const realm = await prisma.realm.findFirst({
    where: {
      id: realmId,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id, role: { in: ["ADMIN", "OWNER"] } } } },
      ],
    },
  });

  if (!realm) {
    return new Response("Realm not found or you don't have admin access", { status: 403 });
  }

  if (!type || !itemID || !toUserID)
    return new Response("Missing required fields", { status: 400 });

  if (type !== "city" && type !== "army")
    return new Response("Invalid type", { status: 400 });

  const toUser = await prisma.user.findUnique({ where: { id: toUserID } });

  if (!toUser) return new Response("Target User not found", { status: 404 });

  if (type === "city") {
    const city = await prisma.city.findUnique({ where: { id: itemID } });
    if (!city) return new Response("City not found", { status: 404 });
    
    if (city.realmId !== realmId) {
      return new Response("City does not belong to this realm", { status: 403 });
    }

    await prisma.city.update({
      where: { id: itemID },
      data: { ownerId: toUserID },
    });

    return NextResponse.json({
      success: true,
      message: `City ${city.name} transferred to ${toUser.name}`,
    });
  }

  if (type === "army") {
    const army = await prisma.army.findUnique({ where: { id: itemID } });
    if (!army) return new Response("Army not found", { status: 404 });
    
    if (army.realmId !== realmId) {
      return new Response("Army does not belong to this realm", { status: 403 });
    }

    await prisma.army.update({
      where: { id: itemID },
      data: { ownerId: toUserID },
    });

    return NextResponse.json({
      success: true,
      message: `Army ${army.name} transferred to ${toUser.name}`,
    });
  }
}
