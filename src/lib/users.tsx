import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data });
    return { user };
  } catch (error) {
    return { error };
  }
}
export async function getUserByID({
  id,
  clerkUserId,
}: {
  id?: string;
  clerkUserId?: string;
}) {
  try {
    if (!id && !clerkUserId) {
      throw new Error("id or clerkUserId is required");
    }
    const query = id ? { id } : { clerkID: clerkUserId };

    const user = await prisma.user.findUnique({ where: query });
    return { user };
  } catch (error) {
    return { error };
  }
}
export async function updateUser(id: string, data: Partial<User>) {
  try {
    const user = await prisma.user.update({ where: { id }, data });
    return { user };
  } catch (error) {
    return { error };
  }
}
