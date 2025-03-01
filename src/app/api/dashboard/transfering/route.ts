// /app/api/dashboard/transfering/route.ts
import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Parse JSON body
  const { toUserId, amount, resource } = await req.json();
  type ResourceType = "wood" | "stone" | "food" | "ducats";
  const resourceKey = resource as ResourceType;

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fromUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      resources: true,
    },
  });
  if (!fromUser) {
    return NextResponse.json({ error: "Sender not found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    const toUser = await tx.user.findUnique({
      where: { id: toUserId },
      include: {
        resources: true,
      },
    });

    if (!toUser) {
      throw new Error("Receiver not found");
    }
    console.log("Checking resource for userId:", fromUser);

    const senderResources = await prisma.resource.findUnique({
      where: { userId: fromUser.id },
    });

    if (!senderResources) {
      console.error("No resource found for userId:", fromUser);
      return null;
    } else {
      console.log("Resource found:", resource);
    }

    if (senderResources[resourceKey] < amount) {
      return NextResponse.json(
        { error: `Not enough ${resourceKey} to transfer.` },
        { status: 400 },
      );
    }

    await tx.resource.update({
      where: { userId: fromUser.id },
      data: {
        [resourceKey]: { decrement: amount },
      },
    });

    await tx.resource.update({
      where: { userId: toUser.id },
      data: {
        [resourceKey]: { increment: amount },
      },
    });
  });

  return NextResponse.json(
    {
      message: "Your resources have been sent successfully!",
    },
    { status: 200 },
  );
}
