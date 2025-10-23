import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();

    // If no user is authenticated, return 401
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current user to check if they're admin
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Find all users with names containing "null"
    const usersWithNullNames = await prisma.user.findMany({
      where: {
        name: {
          contains: "null",
        },
      },
    });

    // Clean up the names
    const updatePromises = usersWithNullNames.map(async (user) => {
      const cleanName = user.name?.replace(/\s+null\s*$/, "").trim();
      if (cleanName && cleanName !== user.name) {
        return prisma.user.update({
          where: { id: user.id },
          data: { name: cleanName },
        });
      }
      return null;
    });

    const results = await Promise.all(updatePromises);
    const updatedUsers = results.filter(Boolean);

    return NextResponse.json({
      message: `Cleaned up ${updatedUsers.length} user names`,
      updatedUsers: updatedUsers.length,
    });
  } catch (error) {
    console.error("Error cleaning up names:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
