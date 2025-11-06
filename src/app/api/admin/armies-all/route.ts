import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

async function requireRealmAdmin(realmId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return { error: new Response("Unauthorized", { status: 401 }) } as const;
  const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
  if (!user) return { error: new Response("User not found", { status: 404 }) } as const;
  
  if (!realmId) {
    return { error: new Response("realmId is required", { status: 400 }) } as const;
  }
  
  // Verify realm exists and user is admin/owner of this realm
  const realm = await prisma.realm.findFirst({
    where: {
      id: realmId,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id, role: { in: ["ADMIN", "OWNER"] } } } },
      ],
    },
  });
  
  if (!realm) {
    return { error: new Response("Realm not found or you don't have admin access", { status: 403 }) } as const;
  }
  
  return { admin: user, realmId } as const;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const realmId = searchParams.get("realmId");
    
    if (!realmId) {
      return NextResponse.json({ error: "realmId is required" }, { status: 400 });
    }
    
    const gate = await requireRealmAdmin(realmId);
    if ("error" in gate) return gate.error;
    
    const armies = await prisma.army.findMany({
      where: { realmId },
      include: { units: true, owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, armies });
  } catch (error) {
    console.error("Error admin armies-all", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


