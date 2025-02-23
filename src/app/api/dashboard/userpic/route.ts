import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();

    // If no user is authenticated, return 401
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const prismaUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: {
        imageUrl: true,
      },
    });
    const img = prismaUser?.imageUrl;
    // Return the user's name
    return NextResponse.json(img);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
