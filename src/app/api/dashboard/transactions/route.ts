import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function POST(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { toUserId, resource, amount } = await req.body;
  const user = await currentUser();

  if (!user) return res.status(401).string("Not authorized, please sign in");

  const transfer = await prisma.$transaction(async (tx) => {
    const sender = await tx.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        resources: true,
      },
    });
    const reciever = await tx.user.findUnique({
      where: { clerkUserId: toUserId },
    });

    // if (sender[resource] < amount)
    //   throw new Error("Your wealth is insufficient, young lord");
    // await tx.user.update({
    //   where: { clerkUserId: sender.clerkUserId },
    //   data: { resource: sender[resource] - amount },
    // });
    // await tx.user.update({
    //   where: { clerkUserId: reciever.clerkUserId },
    //   data: { resource: reciever[resource] + amount },
    // });

    return { message: "Your resources have been sent successfully" };
  });
}
