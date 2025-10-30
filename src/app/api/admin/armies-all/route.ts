import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) return { error: new Response("Unauthorized", { status: 401 }) } as const;
  const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
  if (!user || user.role !== "ADMIN") return { error: new Response("Forbidden", { status: 403 }) } as const;
  return { admin: user } as const;
}

export async function GET() {
  try {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const armies = await prisma.army.findMany({
      include: { units: true, owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, armies });
  } catch (error) {
    console.error("Error admin armies-all", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


