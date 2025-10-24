// /app/api/dashboard/transfering/route.ts
import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const { toUserId, amount, resource } = await req.json();
    type ResourceType =
      | "wood"
      | "stone"
      | "food"
      | "currency"
      | "metal"
      | "livestock";
    const resourceKey = resource as ResourceType;

    // Validate input
    if (!toUserId || !amount || !resource) {
      return NextResponse.json(
        { error: "Missing required fields: toUserId, amount, or resource" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

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

    if (!fromUser.resources) {
      return NextResponse.json(
        { error: "Sender has no resources" },
        { status: 404 }
      );
    }

    // Pre-transaction validation: Check if sender has enough resources
    if (fromUser.resources[resourceKey] < amount) {
      return NextResponse.json(
        {
          error: `Insufficient ${resourceKey}. You have ${fromUser.resources[resourceKey]} but need ${amount}.`,
          currentAmount: fromUser.resources[resourceKey],
          requestedAmount: amount,
          resource: resourceKey,
        },
        { status: 400 }
      );
    }

    // Execute transaction
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

      if (!toUser.resources) {
        throw new Error("Receiver has no resources");
      }

      // Update sender's resources (subtract)
      await tx.resource.update({
        where: { userId: fromUser.id },
        data: {
          [resourceKey]: { decrement: amount },
        },
      });

      // Update receiver's resources (add)
      await tx.resource.update({
        where: { userId: toUser.id },
        data: {
          [resourceKey]: { increment: amount },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully sent ${amount} ${resourceKey}`,
        amount: amount,
        resource: resourceKey,
        receiverId: toUserId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      {
        error: "Transaction failed. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
