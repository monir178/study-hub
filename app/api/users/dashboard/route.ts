import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // Get user's study sessions
    const studySessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 10,
    });

    // Get user's joined rooms
    const joinedRooms = await prisma.roomMember.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            members: {
              include: {
                user: {
                  select: { name: true, image: true },
                },
              },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      take: 5,
    });

    // Get user's created notes
    const recentNotes = await prisma.note.findMany({
      where: { createdBy: userId },
      include: {
        room: {
          select: { name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    // Calculate statistics
    const totalStudyTime = studySessions.reduce(
      (total, session) => total + (session.duration || 0),
      0,
    );

    const totalSessions = studySessions.length;

    const createdRooms = await prisma.studyRoom.count({
      where: { creatorId: userId },
    });

    const privateRooms = await prisma.studyRoom.count({
      where: {
        creatorId: userId,
        isPublic: false,
      },
    });

    const joinedRoomsCount = await prisma.roomMember.count({
      where: { userId },
    });

    // Get study time by day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studyTimeByDay = await prisma.studySession.groupBy({
      by: ["startedAt"],
      where: {
        userId,
        startedAt: { gte: sevenDaysAgo },
      },
      _sum: {
        duration: true,
      },
    });

    // Get session types distribution
    const sessionTypes = await prisma.studySession.groupBy({
      by: ["type"],
      where: { userId },
      _count: {
        type: true,
      },
    });

    // Get room activity
    const roomActivity = await prisma.roomMember.groupBy({
      by: ["roomId"],
      where: { userId },
      _count: {
        roomId: true,
      },
    });

    // Calculate study streak
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStudySessions = await prisma.studySession.groupBy({
      by: ["startedAt"],
      where: {
        userId,
        startedAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        duration: true,
      },
    });

    // Calculate consecutive days with study activity
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

    // Calculate trends (current week vs previous week)
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    const previousWeekStart = new Date();
    previousWeekStart.setDate(previousWeekStart.getDate() - 14);

    const currentWeekSessions = await prisma.studySession.findMany({
      where: {
        userId,
        startedAt: { gte: currentWeekStart },
      },
    });

    const previousWeekSessions = await prisma.studySession.findMany({
      where: {
        userId,
        startedAt: {
          gte: previousWeekStart,
          lt: currentWeekStart,
        },
      },
    });

    const currentWeekTime = currentWeekSessions.reduce(
      (total, session) => total + (session.duration || 0),
      0,
    );
    const previousWeekTime = previousWeekSessions.reduce(
      (total, session) => total + (session.duration || 0),
      0,
    );
    const currentWeekCount = currentWeekSessions.length;
    const previousWeekCount = previousWeekSessions.length;

    // Calculate percentage changes
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

    // Get recent room activity for trend
    const currentWeekRooms = await prisma.roomMember.count({
      where: {
        userId,
        joinedAt: { gte: currentWeekStart },
      },
    });

    const previousWeekRooms = await prisma.roomMember.count({
      where: {
        userId,
        joinedAt: {
          gte: previousWeekStart,
          lt: currentWeekStart,
        },
      },
    });

    const roomChangeCount = currentWeekRooms - previousWeekRooms;
    const roomChangePercent =
      previousWeekRooms > 0
        ? Math.round(
            ((currentWeekRooms - previousWeekRooms) / previousWeekRooms) * 100,
          )
        : currentWeekRooms > 0
          ? 100
          : 0;

    // Get private rooms trend
    const currentWeekPrivateRooms = await prisma.studyRoom.count({
      where: {
        creatorId: userId,
        isPublic: false,
        createdAt: { gte: currentWeekStart },
      },
    });

    const previousWeekPrivateRooms = await prisma.studyRoom.count({
      where: {
        creatorId: userId,
        isPublic: false,
        createdAt: {
          gte: previousWeekStart,
          lt: currentWeekStart,
        },
      },
    });

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

    // Get created rooms trend (total rooms created)
    const currentWeekCreatedRooms = await prisma.studyRoom.count({
      where: {
        creatorId: userId,
        createdAt: { gte: currentWeekStart },
      },
    });

    const previousWeekCreatedRooms = await prisma.studyRoom.count({
      where: {
        creatorId: userId,
        createdAt: {
          gte: previousWeekStart,
          lt: currentWeekStart,
        },
      },
    });

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
