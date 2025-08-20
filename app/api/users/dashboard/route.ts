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
          endedAt: true,
          duration: true,
          type: true,
          status: true,
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

      // Get study sessions for the last 7 days (we'll aggregate by day in JavaScript)
      prisma.studySession.findMany({
        where: {
          userId,
          startedAt: { gte: sevenDaysAgo },
        },
        select: {
          startedAt: true,
          endedAt: true,
          duration: true,
          status: true,
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
      prisma.studySession.findMany({
        where: {
          userId,
          startedAt: { gte: thirtyDaysAgo },
        },
        select: {
          startedAt: true,
          endedAt: true,
          duration: true,
          status: true,
        },
      }),

      // Get weekly statistics for trends
      prisma.$transaction([
        prisma.studySession.findMany({
          where: {
            userId,
            startedAt: { gte: currentWeekStart },
          },
          select: {
            startedAt: true,
            endedAt: true,
            duration: true,
            status: true,
          },
        }),
        prisma.studySession.findMany({
          where: {
            userId,
            startedAt: { gte: previousWeekStart, lt: currentWeekStart },
          },
          select: {
            startedAt: true,
            endedAt: true,
            duration: true,
            status: true,
          },
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
    const [currentWeekSessions, previousWeekSessions] = weeklyStats;

    // Function to calculate actual duration for any session
    const calculateSessionDuration = (session: any): number => {
      if (session.status === "COMPLETED") {
        // For completed sessions, prefer stored duration if it exists and > 0
        if (session.duration && session.duration > 0) {
          return session.duration;
        }

        // Fallback: calculate from startedAt to endedAt for old completed sessions
        if (session.endedAt) {
          const startTime = new Date(session.startedAt);
          const endTime = new Date(session.endedAt);
          return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        }
      }

      // For active/paused sessions, calculate from start time
      if (session.status === "ACTIVE" || session.status === "PAUSED") {
        const endTime = session.endedAt
          ? new Date(session.endedAt)
          : new Date();
        const startTime = new Date(session.startedAt);
        return Math.floor((endTime.getTime() - startTime.getTime()) / 1000); // Convert to seconds
      }

      // For cancelled sessions or fallback, use stored duration or 0
      return session.duration || 0;
    };

    // Calculate weekly totals with dynamic duration
    const currentWeekTime = currentWeekSessions.reduce(
      (total: number, session: any) => {
        return total + calculateSessionDuration(session);
      },
      0,
    );

    const previousWeekTime = previousWeekSessions.reduce(
      (total: number, session: any) => {
        return total + calculateSessionDuration(session);
      },
      0,
    );

    const currentWeekCount = currentWeekSessions.length;
    const previousWeekCount = previousWeekSessions.length;

    // Calculate basic statistics - use dynamic duration calculation
    const totalStudyTime = studySessions.reduce((total, session) => {
      return total + calculateSessionDuration(session);
    }, 0);
    const totalSessions = studySessions.length;

    // Calculate study streak efficiently with dynamic duration
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Aggregate daily sessions for streak calculation with dynamic duration
    const dailySessionsMap = new Map<string, number>();

    dailyStudySessions.forEach((session) => {
      const sessionDate = new Date(session.startedAt);
      const dateKey = sessionDate.toISOString().split("T")[0];
      const currentTotal = dailySessionsMap.get(dateKey) || 0;
      const sessionDuration = calculateSessionDuration(session);
      dailySessionsMap.set(dateKey, currentTotal + sessionDuration);
    });

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = checkDate.toISOString().split("T")[0];

      const hasStudyOnDate =
        dailySessionsMap.has(dateKey) &&
        (dailySessionsMap.get(dateKey) || 0) > 0;

      if (hasStudyOnDate) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 0;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    // Aggregate study time by day (JavaScript aggregation with dynamic duration calculation)
    const studyTimeByDayMap = new Map<string, number>();

    // Process the raw study time data with dynamic duration
    studyTimeByDay.forEach((session) => {
      const sessionDate = new Date(session.startedAt);
      const dateKey = sessionDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      const currentTotal = studyTimeByDayMap.get(dateKey) || 0;
      const sessionDuration = calculateSessionDuration(session);
      studyTimeByDayMap.set(dateKey, currentTotal + sessionDuration);
    });

    // Convert map to array format expected by frontend
    const aggregatedStudyTimeByDay = Array.from(
      studyTimeByDayMap.entries(),
    ).map(([date, totalDuration]) => ({
      startedAt: date,
      _sum: {
        duration: totalDuration,
      },
    }));

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
          days: dailySessionsMap.size, // Number of unique days with study sessions
        },
        recentSessions: studySessions,
        recentRooms: joinedRooms,
        recentNotes,
        studyTimeByDay: aggregatedStudyTimeByDay,
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
