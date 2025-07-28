import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ApiResponse, ApiError } from "@/lib/api/types";

// Using HTTP polling instead of broadcasting for better reliability

const updateStatusSchema = z.object({
  status: z.enum(["ONLINE", "OFFLINE", "STUDYING", "BREAK"]),
});

// PUT /api/rooms/[id]/status - Update member status
export async function PUT(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  try {
    const params = await paramsPromise;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        } satisfies ApiError,
        { status: 401 },
      );
    }

    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    // Find the member record
    const member = await prisma.roomMember.findFirst({
      where: {
        userId: session.user.id,
        roomId: params.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not a member of this room",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    // Update member status
    await prisma.roomMember.update({
      where: { id: member.id },
      data: { status },
    });

    // Room data will be updated via HTTP polling

    return NextResponse.json({
      success: true,
      data: null,
      message: "Status updated successfully",
    } satisfies ApiResponse<null>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: error.issues.map((e) => e.message).join(", "),
        } satisfies ApiError,
        { status: 400 },
      );
    }

    console.error("Error updating member status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update status",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
