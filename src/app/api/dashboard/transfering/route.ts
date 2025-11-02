// /app/api/dashboard/transfering/route.ts
import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const { toUserId, realmId, amount, resource } = await req.json();
    type ResourceType =
      | "wood"
      | "stone"
      | "food"
      | "currency"
      | "metal"
      | "livestock";
    const resourceKey = resource as ResourceType;

    // Validate input
    if (!toUserId || !realmId || !amount || !resource) {
      return NextResponse.json(
        { error: "Missing required fields: toUserId, realmId, amount, or resource" },
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
    });

    if (!fromUser) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Verify both users are members of the realm
    const realm = await prisma.realm.findFirst({
      where: {
        id: realmId,
        OR: [{ ownerId: fromUser.id }, { members: { some: { userId: fromUser.id } } }],
      },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found or access denied" },
        { status: 403 }
      );
    }

    // Get sender's resources in this realm
    let fromResource = await prisma.resource.findUnique({
      where: {
        realmId_userId: {
          realmId,
          userId: fromUser.id,
        },
      },
    });

    if (!fromResource) {
      return NextResponse.json(
        { error: "Sender has no resources in this realm" },
        { status: 404 }
      );
    }

    // Pre-transaction validation: Check if sender has enough resources
    if (fromResource[resourceKey] < amount) {
      return NextResponse.json(
        {
          error: `Insufficient ${resourceKey}. You have ${fromResource[resourceKey]} but need ${amount}.`,
          currentAmount: fromResource[resourceKey],
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
      });

      if (!toUser) {
        throw new Error("Receiver not found");
      }

      // Verify receiver is a member of the realm
      const receiverMembership = await tx.realmMember.findUnique({
        where: {
          realmId_userId: {
            realmId,
            userId: toUserId,
          },
        },
      });

      const isReceiverOwner = realm.ownerId === toUserId;
      if (!isReceiverOwner && !receiverMembership) {
        throw new Error("Receiver is not a member of this realm");
      }

      // Get or create receiver's resources
      let toResource = await tx.resource.findUnique({
        where: {
          realmId_userId: {
            realmId,
            userId: toUserId,
          },
        },
      });

      if (!toResource) {
        toResource = await tx.resource.create({
          data: {
            userId: toUserId,
            realmId,
            wood: 0,
            stone: 0,
            food: 0,
            currency: 0,
            metal: 0,
            livestock: 0,
          },
        });
      }

      // Update sender's resources (subtract)
      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId,
            userId: fromUser.id,
          },
        },
        data: {
          [resourceKey]: { decrement: amount },
        },
      });

      // Update receiver's resources (add)
      await tx.resource.update({
        where: {
          realmId_userId: {
            realmId,
            userId: toUserId,
          },
        },
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
