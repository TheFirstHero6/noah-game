import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const loggedInUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      resources: true,
    },
  });

  if (!loggedInUser) {
    return res.status(401).json({
      error: "You must be logged in to check resources",
    });
  }
  if (!loggedInUser.resources) {
    return null;
  }
}
