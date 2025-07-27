import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and moderator can access moderator stats
    if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user stats
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Active in last 7 days
        },
      },
    });
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Mock data for sessions and reports until those models are implemented
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisWeek: newUsersThisWeek,
      },
      sessions: {
        total: 456, // Mock data
        thisWeek: 67, // Mock data
        moderated: 12, // Mock data
      },
      reports: {
        pending: 5, // Mock data
        resolved: 34, // Mock data
        dismissed: 8, // Mock data
      },
      content: {
        reviewed: 156, // Mock data
        flagged: 7, // Mock data
        approved: 149, // Mock data
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching moderator stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
