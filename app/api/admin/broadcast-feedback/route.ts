import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UnifiedEmailService } from "@/lib/email/unified-email.service";

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();

    // Ensure only an admin can trigger this
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users who have an email
    const users = await prisma.user.findMany({
      where: {
        email: { not: "" },
      },
      select: {
        email: true,
        name: true,
      },
    });

    let sentCount = 0;

    // Iterate and send emails
    for (const user of users) {
      if (!user.email) continue;

      const firstName = user.name?.split(" ")[0] || "User";

      await UnifiedEmailService.sendFeedbackEmail(user.email, firstName);

      await prisma.user.update({
        where: { email: user.email },
        data: { feedbackEmailsSent: { increment: 1 } },
      });

      sentCount++;

      // Delay for 1 second between emails to prevent Gmail rate-limit or spam blocking
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      success: true,
      count: sentCount,
      message: `Successfully sent feedback email to ${sentCount} users.`,
    });
  } catch (error) {
    console.error("Error broadcasting feedback emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
