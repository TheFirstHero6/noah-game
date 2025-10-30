import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET: List current user's armies with units
export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });

    const armies = await prisma.army.findMany({
      where: { ownerId: user.id },
      include: { units: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, armies });
  } catch (error) {
    console.error("Error fetching armies", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// POST: Create a new empty army { name }
export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });

    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return new Response("Invalid name", { status: 400 });
    }

    const army = await prisma.army.create({
      data: { name, ownerId: user.id },
      include: { units: true },
    });
    return NextResponse.json({ success: true, army });
  } catch (error) {
    console.error("Error creating army", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

