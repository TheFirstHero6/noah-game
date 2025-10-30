import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) return new Response("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { id: true, role: true },
  });

  if (!admin || admin.role !== "ADMIN")
    return new Response("Forbidden", { status: 403 });

  const { type, itemID, toUserID } = await req.json();

  if (!type || !itemID || !toUserID)
    return new Response("Missing required fields", { status: 400 });

  if (type !== "city" && type !== "army")
    return new Response("Invalid type", { status: 400 });

  const toUser = await prisma.user.findUnique({ where: { id: toUserID } });

  if (!toUser) return new Response("Target User not found", { status: 404 });

  if (type === "city") {
    const city = await prisma.city.findUnique({ where: { id: itemID } });
    if (!city) return new Response("City not found", { status: 404 });

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
