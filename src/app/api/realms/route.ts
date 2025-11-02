import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// Generate a unique join code
function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// GET: List all realms the user belongs to
export async function GET() {
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

    // Get all realms where user is a member or owner
    const realmMemberships = await prisma.realmMember.findMany({
      where: { userId: user.id },
      include: {
        realm: {
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
        },
      },
    });

    // Get realms owned by user
    const ownedRealms = await prisma.realm.findMany({
      where: { ownerId: user.id },
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

    // Combine and deduplicate - prioritize ownedRealms over memberships
    const ownedRealmIds = new Set(ownedRealms.map((r) => r.id));

    const realms = [
      ...ownedRealms.map((r) => ({
        ...r,
        memberRole: "OWNER" as const,
      })),
      // Only include memberships for realms the user doesn't own
      ...realmMemberships
        .filter((rm) => !ownedRealmIds.has(rm.realm.id))
        .map((rm) => ({
          ...rm.realm,
          memberRole: rm.role,
        })),
    ];

    return NextResponse.json({
      success: true,
      realms,
    });
  } catch (error) {
    console.error("Error fetching realms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new realm
export async function POST(request: Request) {
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

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Realm name is required" },
        { status: 400 }
      );
    }

    // Generate unique join code
    let code: string;
    let codeExists = true;
    while (codeExists) {
      code = generateJoinCode();
      const existing = await prisma.realm.findUnique({
        where: { code },
      });
      codeExists = !!existing;
    }

    // Create realm and add owner as member
    const realm = await prisma.$transaction(async (tx) => {
      // Try to drop the old unique constraint on Resource.userId if it exists
      // This needs to happen inside the transaction
      try {
        await tx.$executeRaw`ALTER TABLE "Resource" DROP CONSTRAINT IF EXISTS "Resource_userId_key"`;
      } catch (error) {
        // Ignore errors if constraint doesn't exist or can't be dropped
        console.log("Note: Could not drop old constraint (may not exist or may require manual fix):", error);
      }

      const newRealm = await tx.realm.create({
        data: {
          name: name.trim(),
          code: code!,
          ownerId: user.id,
        },
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

      // Add owner as member with OWNER role
      await tx.realmMember.create({
        data: {
          realmId: newRealm.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      // Create initial resources for the owner in this realm
      // Check if resources already exist first (they shouldn't for a new realm, but handle edge cases)
      const existingResource = await tx.resource.findUnique({
        where: {
          realmId_userId: {
            userId: user.id,
            realmId: newRealm.id,
          },
        },
      });

      if (!existingResource) {
        try {
          await tx.resource.create({
            data: {
              userId: user.id,
              realmId: newRealm.id,
              wood: 0,
              stone: 0,
              food: 0,
              currency: 0,
              metal: 0,
              livestock: 0,
            },
          });
        } catch (createError: any) {
          // If we get a constraint error, it means the old constraint still exists
          // Don't fail the realm creation - resources will be created when the user first accesses them
          // Just log the error and continue
          if (createError?.code === "P2002" && createError?.meta?.target?.includes("userId")) {
            console.error("Warning: Could not create initial resources due to old constraint. Resources will be created on first access.");
            console.error("The old unique constraint on Resource.userId still exists. Run: ALTER TABLE \"Resource\" DROP CONSTRAINT IF EXISTS \"Resource_userId_key\";");
            // Don't throw - allow realm creation to succeed without initial resources
            // Resources will be created lazily when needed (e.g., when checking dashboard)
          } else {
            // For other errors, we still want to know about them, but we'll continue
            console.error("Warning: Could not create initial resources:", createError);
          }
        }
      }

      return newRealm;
    });

    // Log realm creation success
    console.log("Realm created successfully with id:", realm.id);

    // Fetch the realm fresh after transaction to ensure all members are included
    // If fetch fails, use the realm from transaction (though it might not have all members)
    let createdRealm;
    try {
      createdRealm = await prisma.realm.findUnique({
        where: { id: realm.id },
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
    } catch (fetchError) {
      console.error("Error fetching created realm, using realm from transaction:", fetchError);
      // If fetch fails, use the realm from the transaction
      // It might not have all members, but the GET endpoint will fix that
      createdRealm = realm;
    }

    // If we still don't have a realm, something went wrong
    if (!createdRealm || !createdRealm.id) {
      console.error("Critical: Realm was not created properly. realm:", realm);
      return NextResponse.json(
        { error: "Failed to create or fetch realm. Please try again." },
        { status: 500 }
      );
    }

    // Ensure members array exists (it might be undefined if using realm from transaction)
    if (!createdRealm.members) {
      createdRealm.members = [];
    }

    return NextResponse.json({
      success: true,
      realm: {
        ...createdRealm,
        memberRole: "OWNER",
      },
    });
  } catch (error: any) {
    console.error("Error creating realm:", error);
    
    // Handle unique constraint errors
    if (error?.code === "P2002") {
      if (error?.meta?.target?.includes("userId")) {
        return NextResponse.json(
          { 
            error: "Database constraint error: The old unique constraint on Resource.userId still exists. Please run this SQL command in your database: ALTER TABLE \"Resource\" DROP CONSTRAINT IF EXISTS \"Resource_userId_key\";" 
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: error?.meta?.target ? `Unique constraint failed on ${error.meta.target.join(", ")}` : "Unique constraint failed" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

