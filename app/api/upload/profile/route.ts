import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiResponse, ApiError } from "@/lib/api/types";
import { uploadFile } from "@/lib/utils/cloudinary";

// POST /api/upload/profile - Upload profile picture to Cloudinary
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

    // Add timeout for large file uploads
    const timeoutDuration = 60000; // 1 minute for profile pictures
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Upload timeout")), timeoutDuration);
    });

    const uploadPromise = async () => {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: "No file provided",
          } satisfies ApiError,
          { status: 400 },
        );
      }

      // Validate file type - only images
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            error: "Only image files are allowed",
          } satisfies ApiError,
          { status: 400 },
        );
      }

      // Check file size (5MB limit for profile pictures)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: "File size exceeds 5MB limit",
          } satisfies ApiError,
          { status: 413 },
        );
      }

      // Upload file using Cloudinary with profile-specific folder
      const profileFolderId = `profile_${session.user.id}`;
      const result = (await uploadFile(file, profileFolderId)) as {
        url: string;
        publicId: string;
        format: string;
        size: number;
        fileName: string;
        resourceType: string;
        width?: number;
        height?: number;
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
          ...(result.width &&
            result.height && {
              dimensions: {
                width: result.width,
                height: result.height,
              },
            }),
        },
      } satisfies ApiResponse<{
        url: string;
        publicId: string;
        format: string;
        size: number;
        fileName: string;
        resourceType: string;
        dimensions?: {
          width: number;
          height: number;
        };
      }>);
    };

    // Race between upload and timeout
    const result = await Promise.race([uploadPromise(), timeoutPromise]);
    return result;
  } catch (error) {
    console.error("Profile upload error:", error);

    if (error instanceof Error) {
      if (error.message === "Upload timeout") {
        return NextResponse.json(
          {
            success: false,
            error: "Upload timeout. Please try again with a smaller file.",
          } satisfies ApiError,
          { status: 408 }, // Request Timeout
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        } satisfies ApiError,
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload profile picture",
      } satisfies ApiError,
      { status: 500 },
    );
  }
}
