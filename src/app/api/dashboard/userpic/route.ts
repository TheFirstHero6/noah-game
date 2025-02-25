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

    const img = clerkUser.imageUrl
      ? clerkUser.imageUrl
      : "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yc1lIekdxbW9QWnAxSE13SmZ0Q3FRTnk4bnciLCJyaWQiOiJ1c2VyXzJ0VnB1ajdGRFA4cEhWVzZ3cGFBd0RVMENNcyIsImluaXRpYWxzIjoiSCJ9";
    // Return the user's name
    return NextResponse.json(img);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
