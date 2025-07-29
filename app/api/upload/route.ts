import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiResponse, ApiError } from "@/lib/api/types";
import { uploadFile } from "@/lib/utils/cloudinary";

// POST /api/upload - Upload file to Cloudinary
export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const roomId = formData.get("roomId") as string;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          error: "Room ID is required",
        } satisfies ApiError,
        { status: 400 },
      );
    }

    // Upload file using our enhanced Cloudinary utils
    const result = await uploadFile(file, roomId);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: result.size,
        fileName: result.fileName,
        resourceType: result.resourceType,
        width: result.width,
        height: result.height,
        duration: result.duration,
      },
      message: "File uploaded successfully",
    } satisfies ApiResponse<{
      url: string;
      publicId: string;
      format: string;
      size: number;
      fileName: string;
      resourceType: string;
      width?: number;
      height?: number;
      duration?: number;
    }>);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
