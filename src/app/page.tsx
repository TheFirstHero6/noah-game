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

  console.log(
    "Home: Existing user by email:",
    existingUser ? "Found" : "Not found"
  );
  console.log(
    "Home: Logged in user by clerkId:",
    loggedInUser ? "Found" : "Not found"
  );

  if (!loggedInUser) {
    if (existingUser) {
      // User exists by email but not by clerkUserId - update the existing user
      console.log("Home: Updating existing user with clerkUserId...");
      try {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            clerkUserId: user.id,
            name: user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName ||
                user.emailAddresses[0].emailAddress.split("@")[0],
            imageUrl: user.imageUrl,
          },
        });
        console.log("Home: Existing user updated with clerkUserId");
      } catch (error) {
        console.error("Home: Error updating existing user:", error);
      }
    } else {
      // Create new user
      console.log("Home: Creating new user...");
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkUserId: user.id,
            name: user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName ||
                user.emailAddresses[0].emailAddress.split("@")[0],
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            theme: "royal-court", // Set default theme
            resources: {
              create: {
                wood: 0,
                stone: 0,
                food: 0,
                currency: 0.0,
                metal: 0,
                livestock: 0,
              },
            },
          },
        });
        console.log("Home: New user created successfully:", newUser.id);
      } catch (error) {
        console.error("Home: Error creating user:", error);
      }
    }
  } else {
    console.log(
      "Home: User already exists with correct clerkUserId, skipping creation"
    );
  }

  return <GameInfo />;
}
