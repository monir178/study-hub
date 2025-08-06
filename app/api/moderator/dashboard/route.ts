import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and moderator can access moderator dashboard
    if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get user statistics
    const [totalUsers, newUsersThisWeek, usersByRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
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

    // Get room statistics
    const [totalRooms, publicRooms, privateRooms, activeRoomsToday] =
      await Promise.all([
        prisma.studyRoom.count(),
        prisma.studyRoom.count({
          where: { isPublic: true },
        }),
        prisma.studyRoom.count({
          where: { isPublic: false },
        }),
        // Count rooms that had activity today (messages, sessions, or member joins)
        prisma.studyRoom.count({
          where: {
            OR: [
              // Rooms with messages today
              {
                messages: {
                  some: {
                    createdAt: {
                      gte: oneDayAgo,
                    },
                  },
                },
              },
              // Rooms with study sessions today
              {
                studySessions: {
                  some: {
                    startedAt: {
                      gte: oneDayAgo,
                    },
                  },
                },
              },
              // Rooms with new members today
              {
                members: {
                  some: {
                    joinedAt: {
                      gte: oneDayAgo,
                    },
                  },
                },
              },
            ],
          },
        }),
      ]);

    // Get session statistics
    const [
      totalSessions,
      activeSessions,
      completedSessionsToday,
      sessionsByType,
    ] = await Promise.all([
      prisma.studySession.count(),
      prisma.studySession.count({
        where: { status: "ACTIVE" },
      }),
      prisma.studySession.count({
        where: {
          status: "COMPLETED",
          endedAt: {
            gte: oneDayAgo,
          },
        },
      }),
      prisma.studySession.groupBy({
        by: ["type"],
        _count: {
          type: true,
        },
      }),
    ]);

    // Get message statistics
    const [messagesToday, messagesThisWeek] = await Promise.all([
      prisma.message.count({
        where: {
          createdAt: {
            gte: oneDayAgo,
          },
        },
      }),
      prisma.message.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      }),
    ]);

    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Get recent rooms (last 10)
    const recentRooms = await prisma.studyRoom.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        isPublic: true,
        maxMembers: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // Get recent sessions (last 10)
    const recentSessions = await prisma.studySession.findMany({
      take: 10,
      orderBy: {
        startedAt: "desc",
      },
      select: {
        id: true,
        type: true,
        status: true,
        duration: true,
        startedAt: true,
        endedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent messages (last 10)
    const recentMessages = await prisma.message.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
      },
    });

    // Process user role counts
    const roleStats = {
      users: 0,
      moderators: 0,
      admins: 0,
    };

    usersByRole.forEach((group) => {
      switch (group.role) {
        case "USER":
          roleStats.users = group._count.role;
          break;
        case "MODERATOR":
          roleStats.moderators = group._count.role;
          break;
        case "ADMIN":
          roleStats.admins = group._count.role;
          break;
      }
    });

    // Process session type counts
    const sessionTypeStats = {
      pomodoro: 0,
      custom: 0,
      break: 0,
    };

    sessionsByType.forEach((group) => {
      switch (group.type) {
        case "POMODORO":
          sessionTypeStats.pomodoro = group._count.type;
          break;
        case "CUSTOM":
          sessionTypeStats.custom = group._count.type;
          break;
        case "BREAK":
          sessionTypeStats.break = group._count.type;
          break;
      }
    });

    // Build response data
    const dashboardData = {
      stats: {
        users: {
          total: totalUsers,
          newThisWeek: newUsersThisWeek,
          byRole: roleStats,
        },
        rooms: {
          total: totalRooms,
          public: publicRooms,
          private: privateRooms,
          activeToday: activeRoomsToday,
        },
        sessions: {
          total: totalSessions,
          activeNow: activeSessions,
          completedToday: completedSessionsToday,
          byType: sessionTypeStats,
        },
        messages: {
          totalToday: messagesToday,
          totalThisWeek: messagesThisWeek,
        },
      },
      recentUsers: recentUsers.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      })),
      recentRooms: recentRooms.map((room) => ({
        ...room,
        createdAt: room.createdAt.toISOString(),
      })),
      recentSessions: recentSessions.map((session) => ({
        ...session,
        startedAt: session.startedAt.toISOString(),
        endedAt: session.endedAt?.toISOString() || null,
      })),
      recentMessages: recentMessages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching moderator dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
