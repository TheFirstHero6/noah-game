import GameInfo from "../components/game-info";
import prisma from "./lib/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    return <GameInfo />;
  }
  console.log("Connecting to:", process.env.DATABASE_URL);

  const existingUser = await prisma.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
  });
  const loggedInUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });
  if (!loggedInUser && !existingUser) {
    await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        theme: "royal-court", // Set default theme
        resources: {
          create: {
            wood: 0,
            stone: 0,
            food: 0,
            ducats: 0,
          },
        },
      },
    });
  }

  return <GameInfo />;
}
