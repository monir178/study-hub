import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withAdmin(async (_req) => {
  try {
    // Get current date for filtering
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get user statistics
    const [totalUsers, recentUsers, usersByRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),
    ]);

    // Get session statistics (placeholder - will be implemented with actual sessions)
    const activeSessions = 0; // TODO: Implement with real session tracking
    const totalSessions = await prisma.studySession.count();

    // Get room statistics
    const [totalRooms, activeRooms] = await Promise.all([
      prisma.studyRoom.count(),
      prisma.studyRoom.count({
        where: {
          // Consider rooms with recent activity as active
          updatedAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    // Get message statistics
    const [totalMessages, todayMessages] = await Promise.all([
      prisma.message.count(),
      prisma.message.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
    ]);

    // Format role statistics
    const roleStats = usersByRole.reduce(
      (acc, stat) => {
        acc[stat.role] = stat._count.role;
        return acc;
      },
      {} as Record<string, number>,
    );

    const stats = {
      users: {
        total: totalUsers,
        roles: roleStats,
        recentCount: recentUsers,
      },
      sessions: {
        active: activeSessions,
        total: totalSessions,
      },
      rooms: {
        total: totalRooms,
        active: activeRooms,
      },
      messages: {
        total: totalMessages,
        today: todayMessages,
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard statistics",
      },
      { status: 500 },
    );
  }
});
