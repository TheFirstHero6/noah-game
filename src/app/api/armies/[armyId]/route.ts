import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";

// DELETE: delete an army owned by current user
export async function DELETE(
  _request: Request,
  { params }: { params: { armyId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new Response("Unauthorized", { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } });
    if (!user) return new Response("Forbidden", { status: 403 });

    const army = await prisma.army.findUnique({ where: { id: params.armyId } });
    if (!army || army.ownerId !== user.id) return new Response("Not Found", { status: 404 });

    await prisma.armyUnit.deleteMany({ where: { armyId: army.id } });
    await prisma.army.delete({ where: { id: army.id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting army", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

