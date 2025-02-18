import GameInfo from "../components/game-info";
import prisma from "./lib/db";
import { Prisma } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { SignedOut } from "@clerk/nextjs";
import { transferResources } from "./lib/resources";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
        <GameInfo />
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      </div>
    );
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
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <GameInfo />
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
