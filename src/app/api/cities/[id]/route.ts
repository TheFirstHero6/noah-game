import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const city = await prisma.city.findFirst({
      where: {
        id: params.id,
        ownerId: user.id,
      },
      include: {
        buildings: true,
      },
    });

    if (!city) {
      return new Response("City not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      city: city,
    });
  } catch (error) {
    console.error("Error fetching city:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { name, taxRate } = await request.json();

    // Validate tax rate - allow any whole number between 0-100
    if (
      taxRate !== undefined &&
      (taxRate < 0 || taxRate > 100 || !Number.isInteger(taxRate))
    ) {
      return NextResponse.json(
        { error: "Tax rate must be a whole number between 0-100%" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (taxRate !== undefined) updateData.taxRate = taxRate;

    const city = await prisma.city.updateMany({
      where: {
        id: params.id,
        ownerId: user.id,
      },
      data: updateData,
    });

    if (city.count === 0) {
      return new Response("City not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "City updated successfully",
    });
  } catch (error) {
    console.error("Error updating city:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
