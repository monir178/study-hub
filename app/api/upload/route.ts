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

    // Add timeout for large file uploads (longer for local development)
    const isDevelopment = process.env.NODE_ENV === "development";
    const timeoutDuration = isDevelopment ? 300000 : 120000; // 5 minutes for dev, 2 minutes for prod

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Upload timeout")), timeoutDuration);
    });

    const uploadPromise = async () => {
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

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: "File size exceeds 50MB limit",
          } satisfies ApiError,
          { status: 413 }, // Payload Too Large
        );
      }

      // Upload file using our enhanced Cloudinary utils
      const result = (await uploadFile(file, roomId)) as {
        url: string;
        publicId: string;
        format: string;
        size: number;
        fileName: string;
        resourceType: string;
        width?: number;
        height?: number;
        duration?: number;
      };

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
    };

    // Race between upload and timeout
    const result = await Promise.race([uploadPromise(), timeoutPromise]);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Upload timeout") {
        return NextResponse.json(
          {
            success: false,
            error: "Upload timeout - file too large or connection too slow",
          } satisfies ApiError,
          { status: 408 }, // Request Timeout
        );
      }

      if (error.message.includes("File size")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          } satisfies ApiError,
          { status: 413 }, // Payload Too Large
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}

// Configure route segment for larger payloads
export const runtime = "nodejs";
export const maxDuration = process.env.NODE_ENV === "development" ? 300 : 120; // 5 minutes for dev, 2 minutes for prod
