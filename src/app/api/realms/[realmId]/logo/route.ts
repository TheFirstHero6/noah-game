import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(
  request: Request,
  context: { params: Promise<{ realmId: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { realmId } = await context.params;

    // Check if user is the owner of this realm
    const realm = await prisma.realm.findUnique({
      where: { id: realmId },
    });

    if (!realm) {
      return NextResponse.json(
        { error: "Realm not found" },
        { status: 404 }
      );
    }

    if (realm.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Only the realm owner can upload a logo" },
        { status: 403 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("logo") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images (PNG, JPEG, WEBP, GIF) are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Get file extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `logo.${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "realms", realmId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create URL path (relative to public folder)
    const logoUrl = `/uploads/realms/${realmId}/${filename}`;

    // Update realm with logo URL
    const updatedRealm = await prisma.realm.update({
      where: { id: realmId },
      data: { logo: logoUrl },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      realm: {
        ...updatedRealm,
        memberRole: "OWNER",
      },
    });
  } catch (error) {
    console.error("Error uploading realm logo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

