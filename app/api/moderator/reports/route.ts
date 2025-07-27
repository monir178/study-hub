import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma"; // TODO: Uncomment when Report model is added

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or moderator
    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // For now, return mock data since Report model doesn't exist yet
    // TODO: Implement proper reports when Report model is added to Prisma schema
    const mockReports = [
      {
        id: "1",
        type: "USER",
        reason: "Inappropriate behavior",
        status: "PENDING",
        createdAt: new Date().toISOString(),
        reporter: {
          id: "user1",
          name: "John Doe",
          email: "john@example.com",
        },
        reportedUser: {
          id: "user2",
          name: "Jane Smith",
          email: "jane@example.com",
        },
      },
      {
        id: "2",
        type: "CONTENT",
        reason: "Spam content",
        status: "RESOLVED",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        reporter: {
          id: "user3",
          name: "Bob Wilson",
          email: "bob@example.com",
        },
        moderator: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
      },
    ];

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Filter by status if provided
    const filteredReports = status
      ? mockReports.filter((report) => report.status === status)
      : mockReports;

    return NextResponse.json(filteredReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or moderator
    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { type, reason, reportedUserId } = body;

    // Validate required fields
    if (!type || !reason) {
      return NextResponse.json(
        { error: "Type and reason are required" },
        { status: 400 },
      );
    }

    // For now, return mock response since Report model doesn't exist yet
    // TODO: Implement proper report creation when Report model is added to Prisma schema
    const mockReport = {
      id: `report_${Date.now()}`,
      type,
      reason,
      reportedUserId,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      reporter: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };

    return NextResponse.json(mockReport, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
