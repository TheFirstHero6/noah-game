import { currentUser, User } from "@clerk/nextjs/server";
import prisma from "../../lib/db";
import { getUserResources } from "../../lib/resources";

export default async function Dashboard() {
  const user = await currentUser();
  const currentUserId = user?.id;
}
