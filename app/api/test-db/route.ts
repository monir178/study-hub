import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Try to count users (this will test if the database and schema work)
    const userCount = await prisma.user.count();

    // Test basic database operations
    const accountCount = await prisma.account.count();
    const sessionCount = await prisma.session.count();

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        database: "studyhub",
        counts: {
          users: userCount,
          accounts: accountCount,
          sessions: sessionCount,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
