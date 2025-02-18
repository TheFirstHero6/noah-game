import { sendError } from "next/dist/server/api-utils";
import prisma from "./db";
import { ResourceType } from "@/types";

export async function getUserResources(userId: string) {
  try {
    return await prisma.resource.findUnique({
      where: { userId },
      select: {
        wood: true,
        stone: true,
        food: true,
        ducats: true,
      },
    });
  } catch (error) {
    console.log("Error Finding Resources", error);
    throw new Error("Failed to find resources");
  }
}
export async function transferResources(
  senderId: string,
  recieverId: string,
  resource: ResourceType,
  amount: number,
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const sender = await tx.resource.findUnique({
        where: { userId: senderId },
      });

      if (!sender || sender[resource] < amount) {
        throw new Error("insufficient funds/resources");
      }
      await tx.resource.update({
        where: { userId: senderId },
        data: { [resource]: { decrement: amount } },
      });
      await tx.resource.update({
        where: { userId: recieverId },
        data: { [resource]: { increment: amount } },
      });

      return { success: true };
    });
  } catch (error) {
    console.log("Failed to transfer resources", error);
    throw new Error("Failed to transfer resources");
  }
}

transferResources(
  "cm789oxxf0000jl03hiz4mg3m",
  "cm78dos090000jy03kwdtfo3v",
  "wood",
  10,
);
