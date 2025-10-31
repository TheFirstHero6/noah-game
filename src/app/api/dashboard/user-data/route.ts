import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("API: Starting user-data fetch...");

    // Get the authenticated user from Clerk
    const clerkUser = await currentUser();
    console.log("API: Clerk user:", clerkUser ? "Found" : "Not found");

    // If no user is authenticated, return 401
    if (!clerkUser) {
      console.log("API: No clerk user, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in our database using their Clerk ID
    console.log("API: Looking up user with clerkUserId:", clerkUser.id);
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      include: {
        resources: true,
      },
    });
    console.log("API: Database user found:", user ? "Yes" : "No");

    // If user doesn't exist in our database, return 404
    if (!user) {
      console.log("API: User not found in database, returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("API: User from database:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Get all users for the user list
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });

    // Prepare user image URL (fallback to default if not available)
    const userImageUrl = clerkUser.imageUrl
      ? clerkUser.imageUrl
      : "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yc1lIekdxbW9QWnAxSE13SmZ0Q3FRTnk4bnciLCJyaWQiOiJ1c2VyXzJ0VnB1ajdGRFA4cEhWVzZ3cGFBd0RVMENNcyIsImluaXRpYWxzIjoiSCJ9";

    // Prepare resources (default to 0 if not available, handle null values)
    const userResources = user.resources
      ? {
          wood: user.resources.wood || 0,
          stone: user.resources.stone || 0,
          food: user.resources.food || 0,
          currency: user.resources.currency || 0.0,
          metal: user.resources.metal || 0,
          livestock: user.resources.livestock || 0,
        }
      : {
          wood: 0,
          stone: 0,
          food: 0,
          currency: 0.0,
          metal: 0,
          livestock: 0,
        };

    // Return all user data in one response
    const responseData = {
      // User profile data
      userpic: userImageUrl,
      username: user.name,
      role: user.role,

      // User resources
      resources: userResources,

      // All users for the user list
      allUsers: allUsers,
    };

    console.log("API: Returning response data:", {
      username: responseData.username,
      role: responseData.role,
      resourcesCount: Object.keys(responseData.resources).length,
      allUsersCount: responseData.allUsers.length,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
