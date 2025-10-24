import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const cities = await prisma.city.findMany({
      where: { ownerId: user.id },
      include: {
        buildings: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      cities: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
