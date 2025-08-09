import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    let userId: string;

    if (!session?.user?.id) {
      // Add a small delay and retry once in case session is still being established
      await new Promise((resolve) => setTimeout(resolve, 500));
      const retrySession = await auth();

      if (!retrySession?.user?.id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 },
        );
      }

      userId = retrySession.user.id;
    } else {
      userId = session.user.id;
    }

    // Define date ranges for efficiency
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const currentWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekStart = new Date(
      now.getTime() - 14 * 24 * 60 * 60 * 1000,
    );

    // Execute all database queries in parallel for much better performance
    const [
      studySessions,
      joinedRooms,
      recentNotes,
      roomCounts,
      studyTimeByDay,
      sessionTypes,
      roomActivity,
      dailyStudySessions,
      weeklyStats,
    ] = await Promise.all([
      // Get user's recent study sessions
      prisma.studySession.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 10,
        select: {
          id: true,
          startedAt: true,
          duration: true,
          type: true,
        },
      }),

      // Get user's joined rooms
      prisma.roomMember.findMany({
        where: { userId },
        include: {
          room: {
            select: {
              id: true,
              name: true,
              description: true,
              isPublic: true,
              maxMembers: true,
              createdAt: true,
              updatedAt: true,
              creatorId: true,
              creator: {
                select: {
                  name: true,
                  image: true,
                },
              },
              members: {
                select: {
                  id: true,
                  role: true,
                  status: true,
                  joinedAt: true,
                  userId: true,
                  roomId: true,
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
        take: 5,
      }),

      // Get user's recent notes
      prisma.note.findMany({
        where: { createdBy: userId },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          room: {
            select: { name: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),

      // Get all room-related counts in one aggregation
      prisma.$transaction([
        prisma.studyRoom.count({ where: { creatorId: userId } }),
        prisma.studyRoom.count({
          where: { creatorId: userId, isPublic: false },
        }),
        prisma.roomMember.count({ where: { userId } }),
        prisma.studyRoom.count({
          where: { creatorId: userId, createdAt: { gte: currentWeekStart } },
        }),
        prisma.studyRoom.count({
          where: {
            creatorId: userId,
            createdAt: { gte: previousWeekStart, lt: currentWeekStart },
          },
        }),
        prisma.studyRoom.count({
          where: {
            creatorId: userId,
            isPublic: false,
            createdAt: { gte: currentWeekStart },
          },
        }),
        prisma.studyRoom.count({
          where: {
            creatorId: userId,
            isPublic: false,
            createdAt: { gte: previousWeekStart, lt: currentWeekStart },
          },
        }),
        prisma.roomMember.count({
          where: { userId, joinedAt: { gte: currentWeekStart } },
        }),
        prisma.roomMember.count({
          where: {
            userId,
            joinedAt: { gte: previousWeekStart, lt: currentWeekStart },
          },
        }),
      ]),

      // Get study time by day for the last 7 days
      prisma.studySession.groupBy({
        by: ["startedAt"],
        where: {
          userId,
          startedAt: { gte: sevenDaysAgo },
        },
        _sum: {
          duration: true,
        },
      }),

      // Get session types distribution
      prisma.studySession.groupBy({
        by: ["type"],
        where: { userId },
        _count: {
          type: true,
        },
      }),

      // Get room activity
      prisma.roomMember.groupBy({
        by: ["roomId"],
        where: { userId },
        _count: {
          roomId: true,
        },
      }),

      // Get daily study sessions for streak calculation (last 30 days)
      prisma.studySession.groupBy({
        by: ["startedAt"],
        where: {
          userId,
          startedAt: { gte: thirtyDaysAgo },
        },
        _sum: {
          duration: true,
        },
      }),

      // Get weekly statistics for trends
      prisma.$transaction([
        prisma.studySession.aggregate({
          where: {
            userId,
            startedAt: { gte: currentWeekStart },
          },
          _sum: { duration: true },
          _count: true,
        }),
        prisma.studySession.aggregate({
          where: {
            userId,
            startedAt: { gte: previousWeekStart, lt: currentWeekStart },
          },
          _sum: { duration: true },
          _count: true,
        }),
      ]),
    ]);

    // Extract room counts from transaction results
    const [
      createdRooms,
      privateRooms,
      joinedRoomsCount,
      currentWeekCreatedRooms,
      previousWeekCreatedRooms,
      currentWeekPrivateRooms,
      previousWeekPrivateRooms,
      currentWeekRooms,
      previousWeekRooms,
    ] = roomCounts;

    // Extract weekly stats
    const [currentWeekStats, previousWeekStats] = weeklyStats;
    const currentWeekTime = currentWeekStats._sum.duration || 0;
    const previousWeekTime = previousWeekStats._sum.duration || 0;
    const currentWeekCount = currentWeekStats._count;
    const previousWeekCount = previousWeekStats._count;

    // Calculate basic statistics
    const totalStudyTime = studySessions.reduce(
      (total, session) => total + (session.duration || 0),
      0,
    );
    const totalSessions = studySessions.length;

    // Calculate study streak efficiently
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const hasStudyOnDate = dailyStudySessions.some((session) => {
        const sessionDate = new Date(session.startedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });

      if (hasStudyOnDate) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 0;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    // Calculate percentage changes for trends
    const timeChangePercent =
      previousWeekTime > 0
        ? Math.round(
            ((currentWeekTime - previousWeekTime) / previousWeekTime) * 100,
          )
        : currentWeekTime > 0
          ? 100
          : 0;

    const sessionChangeCount = currentWeekCount - previousWeekCount;
    const sessionChangePercent =
      previousWeekCount > 0
        ? Math.round(
            ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100,
          )
        : currentWeekCount > 0
          ? 100
          : 0;

    const roomChangeCount = currentWeekRooms - previousWeekRooms;
    const roomChangePercent =
      previousWeekRooms > 0
        ? Math.round(
            ((currentWeekRooms - previousWeekRooms) / previousWeekRooms) * 100,
          )
        : currentWeekRooms > 0
          ? 100
          : 0;

    const privateRoomChangeCount =
      currentWeekPrivateRooms - previousWeekPrivateRooms;
    const privateRoomChangePercent =
      previousWeekPrivateRooms > 0
        ? Math.round(
            ((currentWeekPrivateRooms - previousWeekPrivateRooms) /
              previousWeekPrivateRooms) *
              100,
          )
        : currentWeekPrivateRooms > 0
          ? 100
          : 0;

    const createdRoomChangeCount =
      currentWeekCreatedRooms - previousWeekCreatedRooms;
    const createdRoomChangePercent =
      previousWeekCreatedRooms > 0
        ? Math.round(
            ((currentWeekCreatedRooms - previousWeekCreatedRooms) /
              previousWeekCreatedRooms) *
              100,
          )
        : currentWeekCreatedRooms > 0
          ? 100
          : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalStudyTime,
          totalSessions,
          createdRooms,
          privateRooms,
          joinedRoomsCount,
          averageSessionTime:
            totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0,
        },
        trends: {
          studyTime: {
            change:
              timeChangePercent >= 0
                ? `+${timeChangePercent}%`
                : `${timeChangePercent}%`,
            trend:
              timeChangePercent >= 0
                ? "up"
                : timeChangePercent < 0
                  ? "down"
                  : "neutral",
            changeCount: currentWeekTime - previousWeekTime,
          },
          sessions: {
            change:
              sessionChangePercent >= 0
                ? `+${sessionChangeCount}`
                : `${sessionChangeCount}`,
            trend:
              sessionChangeCount >= 0
                ? "up"
                : sessionChangeCount < 0
                  ? "down"
                  : "neutral",
            changeCount: sessionChangeCount,
          },
          rooms: {
            change:
              roomChangePercent >= 0
                ? `+${roomChangeCount}`
                : `${roomChangeCount}`,
            trend:
              roomChangeCount >= 0
                ? "up"
                : roomChangeCount < 0
                  ? "down"
                  : "neutral",
            changeCount: roomChangeCount,
          },
          createdRooms: {
            change:
              createdRoomChangePercent >= 0
                ? `+${createdRoomChangeCount}`
                : `${createdRoomChangeCount}`,
            trend:
              createdRoomChangeCount >= 0
                ? "up"
                : createdRoomChangeCount < 0
                  ? "down"
                  : "neutral",
            changeCount: createdRoomChangeCount,
          },
          privateRooms: {
            change:
              privateRoomChangePercent >= 0
                ? `+${privateRoomChangeCount}`
                : `${privateRoomChangeCount}`,
            trend:
              privateRoomChangeCount >= 0
                ? "up"
                : privateRoomChangeCount < 0
                  ? "down"
                  : "neutral",
            changeCount: privateRoomChangeCount,
          },
        },
        streak: {
          current: currentStreak,
          max: maxStreak,
          days: dailyStudySessions.length,
        },
        recentSessions: studySessions,
        recentRooms: joinedRooms,
        recentNotes,
        studyTimeByDay,
        sessionTypes,
        roomActivity,
      },
    });
  } catch (error) {
    console.error("Error getting user dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get dashboard data" },
      { status: 500 },
    );
  }
}
