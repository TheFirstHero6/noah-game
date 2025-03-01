// /app/api/dashboard/transfering/route.ts
import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Parse JSON body
  type ResourceType = "wood" | "stone" | "food" | "ducats";

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
