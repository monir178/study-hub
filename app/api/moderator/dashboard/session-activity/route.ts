import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get session activity data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all study sessions for the last 30 days
    const studySessions = await prisma.studySession.findMany({
      where: {
        startedAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        type: true,
        startedAt: true,
      },
    });

    // Create a complete dataset for the last 30 days
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayData = {
        date: dateStr,
        pomodoro: 0,
        custom: 0,
        break: 0,
      };

      // Count sessions for this day
      const daySessions = studySessions.filter((studySession) => {
        const sessionDate = new Date(studySession.startedAt);
        return sessionDate.toISOString().split("T")[0] === dateStr;
      });

      daySessions.forEach((studySession) => {
        switch (studySession.type) {
          case "POMODORO":
            dayData.pomodoro += 1;
            break;
          case "CUSTOM":
            dayData.custom += 1;
            break;
          case "BREAK":
            dayData.break += 1;
            break;
        }
      });

      chartData.push(dayData);
    }

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching session activity data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
