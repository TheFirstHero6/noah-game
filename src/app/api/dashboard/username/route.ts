import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();
    const username = clerkUser?.username ? `${clerkUser.username}` : "";

    // If no user is authenticated, return 401
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Return the user's name
    return NextResponse.json(username);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
