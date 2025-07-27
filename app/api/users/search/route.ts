import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and moderator can search users
    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const roleFilter = searchParams.get("role");

    // Build the where clause for searching
    const whereClause: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
      }>;
      role?: "USER" | "MODERATOR" | "ADMIN";
    } = {};

    // Add search conditions
    if (query && query.trim()) {
      whereClause.OR = [
        {
          name: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Add role filter
    if (roleFilter && roleFilter !== "all") {
      // Validate that roleFilter is a valid role
      if (["USER", "MODERATOR", "ADMIN"].includes(roleFilter)) {
        whereClause.role = roleFilter as "USER" | "MODERATOR" | "ADMIN";
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { role: "asc" }, // Admin first, then moderator, then user
        { createdAt: "desc" },
      ],
      take: 100, // Limit results to avoid performance issues
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
