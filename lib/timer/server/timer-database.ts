import { prisma } from "@/lib/prisma";
import { TimerData } from "@/features/timer/types";

export class TimerDatabase {
  // Save timer state to database with aggressive conflict prevention
  static async saveTimer(roomId: string, timer: TimerData): Promise<void> {
    // Skip saving if it's just a countdown update (remaining time only)
    const isCountdownOnly =
      Object.keys(timer).length === 1 && timer.hasOwnProperty("remaining");
    if (isCountdownOnly) {
      return; // Don't save countdown-only updates to avoid conflicts
    }

    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Use a simple approach to avoid conflicts
        const room = await prisma.studyRoom.findUnique({
          where: { id: roomId },
          select: { creatorId: true },
        });

        if (!room) {
          console.error("Room not found for timer creation");
          return;
        }

        // Find existing session
        const existingSession = await prisma.studySession.findFirst({
          where: {
            roomId,
            status: { in: ["ACTIVE", "PAUSED"] },
          },
          orderBy: { startedAt: "desc" },
        });

        if (existingSession) {
          // Update existing session
          await prisma.studySession.update({
            where: { id: existingSession.id },
            data: {
              duration: timer.remaining,
              phase: timer.phase,
              remaining: timer.remaining,
              session: timer.session,
              totalSessions: timer.totalSessions,
              controlledBy: timer.controlledBy || null,
              status: timer.isRunning
                ? "ACTIVE"
                : timer.isPaused
                  ? "PAUSED"
                  : "COMPLETED",
              endedAt: timer.isRunning ? null : new Date(),
            },
          });
        } else {
          // Create new session
          await prisma.studySession.create({
            data: {
              roomId,
              userId: timer.controlledBy || room.creatorId,
              duration: timer.remaining,
              type: "POMODORO",
              status: timer.isRunning ? "ACTIVE" : "PAUSED",
              phase: timer.phase,
              remaining: timer.remaining,
              session: timer.session,
              totalSessions: timer.totalSessions,
              controlledBy: timer.controlledBy || null,
              endedAt: timer.isRunning ? null : new Date(),
            },
          });
        }

        // Success - break out of retry loop
        break;
      } catch (error: unknown) {
        retryCount++;

        // Check if it's a transaction conflict error
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2034" &&
          retryCount < maxRetries
        ) {
          console.warn(
            `Database transaction conflict, retrying (${retryCount}/${maxRetries})...`,
          );
          // Wait longer with exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, retryCount) * 200),
          );
          continue;
        }

        // If it's not a conflict error or we've exhausted retries, log and return
        console.error("Error saving timer to database:", error);
        break;
      }
    }
  }

  // Load timer state from database
  static async loadTimer(roomId: string): Promise<TimerData | null> {
    try {
      const session = await prisma.studySession.findFirst({
        where: {
          roomId,
          status: { in: ["ACTIVE", "PAUSED"] },
        },
        orderBy: { startedAt: "desc" },
      });

      if (!session) {
        return null;
      }

      return {
        roomId: session.roomId,
        phase: session.phase as "focus" | "break" | "long_break",
        remaining: session.remaining,
        isRunning: session.status === "ACTIVE",
        isPaused: session.status === "PAUSED",
        updatedAt: session.startedAt,
        controlledBy: session.controlledBy || "",
        session: session.session,
        totalSessions: session.totalSessions,
      };
    } catch (error) {
      console.error("Error loading timer from database:", error);
      return null;
    }
  }

  // Complete a session (when timer finishes)
  static async completeSession(
    roomId: string,
    _timer: TimerData,
  ): Promise<void> {
    try {
      const session = await prisma.studySession.findFirst({
        where: {
          roomId,
          status: { in: ["ACTIVE", "PAUSED"] },
        },
        orderBy: { startedAt: "desc" },
      });

      if (session) {
        await prisma.studySession.update({
          where: { id: session.id },
          data: {
            status: "COMPLETED",
            endedAt: new Date(),
            remaining: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  }

  // Get session statistics for a room
  static async getRoomStats(roomId: string): Promise<{
    totalSessions: number;
    totalDuration: number;
    averageSessionLength: number;
    completedSessions: number;
  }> {
    try {
      const sessions = await prisma.studySession.findMany({
        where: {
          roomId,
          status: "COMPLETED",
        },
      });

      const totalSessions = sessions.length;
      const totalDuration = sessions.reduce(
        (sum, session) => sum + session.duration,
        0,
      );
      const averageSessionLength =
        totalSessions > 0 ? totalDuration / totalSessions : 0;
      const completedSessions = sessions.filter(
        (s) => s.status === "COMPLETED",
      ).length;

      return {
        totalSessions,
        totalDuration,
        averageSessionLength,
        completedSessions,
      };
    } catch (error) {
      console.error("Error getting room stats:", error);
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageSessionLength: 0,
        completedSessions: 0,
      };
    }
  }

  // Get user session statistics
  static async getUserStats(userId: string): Promise<{
    totalSessions: number;
    totalDuration: number;
    averageSessionLength: number;
    completedSessions: number;
  }> {
    try {
      const sessions = await prisma.studySession.findMany({
        where: {
          userId,
          status: "COMPLETED",
        },
      });

      const totalSessions = sessions.length;
      const totalDuration = sessions.reduce(
        (sum, session) => sum + session.duration,
        0,
      );
      const averageSessionLength =
        totalSessions > 0 ? totalDuration / totalSessions : 0;
      const completedSessions = sessions.filter(
        (s) => s.status === "COMPLETED",
      ).length;

      return {
        totalSessions,
        totalDuration,
        averageSessionLength,
        completedSessions,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageSessionLength: 0,
        completedSessions: 0,
      };
    }
  }
}
