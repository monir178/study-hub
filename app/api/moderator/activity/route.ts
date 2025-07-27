import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or moderator
    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // For now, return mock activity data since we don't have the activity model yet
    // TODO: Implement proper activity logging when activity model is added to Prisma schema
    const mockActivity = [
      {
        id: "activity_1",
        action: "USER_WARNED",
        description: "Warned user John Doe for inappropriate behavior",
        moderatorId: session.user.id,
        moderatorName: session.user.name,
        targetUserId: "user_123",
        targetUserName: "John Doe",
        timestamp: new Date().toISOString(),
        details: {
          reason: "Inappropriate language in chat",
          sessionId: "session_456",
        },
      },
      {
        id: "activity_2",
        action: "REPORT_RESOLVED",
        description: "Resolved report about spam content",
        moderatorId: session.user.id,
        moderatorName: session.user.name,
        targetUserId: "user_789",
        targetUserName: "Jane Smith",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        details: {
          reportId: "report_101",
          resolution: "Content removed and user warned",
        },
      },
      {
        id: "activity_3",
        action: "USER_SUSPENDED",
        description: "Suspended user for repeated violations",
        moderatorId: "admin_001",
        moderatorName: "Admin User",
        targetUserId: "user_456",
        targetUserName: "Bob Wilson",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        details: {
          reason: "Multiple violations of community guidelines",
          duration: 7, // days
        },
      },
      {
        id: "activity_4",
        action: "CONTENT_REMOVED",
        description: "Removed inappropriate content",
        moderatorId: session.user.id,
        moderatorName: session.user.name,
        targetUserId: "user_321",
        targetUserName: "Alice Johnson",
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        details: {
          contentType: "NOTE",
          contentId: "note_789",
          reason: "Violation of content policy",
        },
      },
      {
        id: "activity_5",
        action: "REPORT_DISMISSED",
        description: "Dismissed false report",
        moderatorId: session.user.id,
        moderatorName: session.user.name,
        timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
        details: {
          reportId: "report_202",
          reason: "No violation found after investigation",
        },
      },
    ];

    return NextResponse.json(mockActivity);
  } catch (error) {
    console.error("Error fetching moderator activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
