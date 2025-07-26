import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withAdmin(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && ["USER", "MODERATOR", "ADMIN"].includes(role)) {
      where.role = role;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          locale: true,
          theme: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              createdRooms: true,
              roomMembers: true,
              messages: true,
              studySessions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Get role statistics
    const roleStats = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats: {
          total,
          roles: roleStats.reduce(
            (acc, stat) => {
              acc[stat.role] = stat._count.role;
              return acc;
            },
            {} as Record<string, number>,
          ),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    );
  }
});

export const POST = withAdmin(async (_req) => {
  try {
    // This would be for creating users as admin
    // Implementation would be similar to register route but with admin privileges
    return NextResponse.json(
      {
        success: false,
        message: "Not implemented yet",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
      },
      { status: 500 },
    );
  }
});
