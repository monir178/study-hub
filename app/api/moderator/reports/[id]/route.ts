import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or moderator
    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // For now, return mock data since Report model doesn't exist yet
    // TODO: Implement proper report fetching when Report model is added to Prisma schema
    const mockReport = {
      id,
      type: "USER",
      reason: "Inappropriate behavior during study session",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      description:
        "User was being disruptive and using inappropriate language during the study session.",
    };

    return NextResponse.json(mockReport);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or moderator
    if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, resolution } = body;

    // Validate status
    if (status && !["PENDING", "RESOLVED", "DISMISSED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // For now, return mock response since Report model doesn't exist yet
    // TODO: Implement proper report update when Report model is added to Prisma schema
    const updatedReport = {
      id,
      type: "USER",
      reason: "Inappropriate behavior during study session",
      status: status || "PENDING",
      resolution: resolution || null,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString(),
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
      moderator: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      description:
        "User was being disruptive and using inappropriate language during the study session.",
    };

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can delete reports
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // For now, just return success since Report model doesn't exist yet
    // TODO: Implement proper report deletion when Report model is added to Prisma schema
    console.log(`Mock deletion of report ${id}`);

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
