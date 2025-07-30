import { v2 as cloudinary } from "cloudinary";

// Ensure this is only used on the server side
if (typeof window !== "undefined") {
  throw new Error("Cloudinary utils can only be used on the server side");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// File type detection and folder mapping
const getFileTypeAndFolder = (file: File) => {
  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) {
    return { resourceType: "image", folder: "studyhub/images" };
  } else if (type.startsWith("audio/")) {
    return { resourceType: "video", folder: "studyhub/audio" };
  } else if (type.startsWith("video/")) {
    return { resourceType: "video", folder: "studyhub/videos" };
  } else if (
    type.includes("pdf") ||
    type.includes("document") ||
    type.includes("text")
  ) {
    return { resourceType: "raw", folder: "studyhub/documents" };
  } else {
    return { resourceType: "auto", folder: "studyhub/files" };
  }
};

// Upload any file type with proper folder organization
export const uploadFile = async (file: File, roomId?: string) => {
  const { resourceType, folder } = getFileTypeAndFolder(file);
  const uploadFolder = roomId ? `${folder}/${roomId}` : folder;

  // For large files, use stream upload instead of base64 to reduce memory usage
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use upload_stream for better memory management with large files
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: uploadFolder,
          resource_type: resourceType as "image" | "video" | "raw" | "auto",
          allowed_formats: [
            // Images
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "svg",
            // Audio
            "mp3",
            "wav",
            "ogg",
            "m4a",
            "aac",
            // Video
            "mp4",
            "mov",
            "avi",
            "webm",
            "mkv",
            // Documents
            "pdf",
            "doc",
            "docx",
            "txt",
            "rtf",
            // Other
            "zip",
            "rar",
          ],
          max_bytes: 50 * 1024 * 1024, // 50MB limit
          transformation:
            resourceType === "image"
              ? [
                  { width: 1200, height: 1200, crop: "limit" },
                  { quality: "auto:good" },
                ]
              : undefined,
          timeout: 120000, // 2 minutes timeout
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              size: result.bytes,
              fileName: file.name,
              resourceType: result.resource_type,
              width: result.width,
              height: result.height,
              duration: result.duration,
            });
          } else {
            reject(new Error("Upload failed - no result"));
          }
        },
      )
      .end(buffer);
  });
};

// Upload image with specific optimizations
export const uploadImage = async (file: File, roomId?: string) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  return uploadFile(file, roomId);
};

// Upload audio file
export const uploadAudio = async (file: File, roomId?: string) => {
  if (!file.type.startsWith("audio/")) {
    throw new Error("File is not an audio file");
  }

  return uploadFile(file, roomId);
};

// Upload video file
export const uploadVideo = async (file: File, roomId?: string) => {
  if (!file.type.startsWith("video/")) {
    throw new Error("File is not a video file");
  }

  return uploadFile(file, roomId);
};

// Upload document
export const uploadDocument = async (file: File, roomId?: string) => {
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error("File is not a supported document type");
  }

  return uploadFile(file, roomId);
};

// Record and upload voice message - SERVER SIDE ONLY
export const recordAndUploadVoice = async (
  audioBlob: Blob,
  roomId?: string,
) => {
  const file = new File([audioBlob], `voice-${Date.now()}.wav`, {
    type: "audio/wav",
  });

  return uploadAudio(file, roomId);
};

// Delete file from Cloudinary
export const deleteFile = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};

// Get file info from Cloudinary
export const getFileInfo = async (publicId: string) => {
  const result = await cloudinary.api.resource(publicId);
  return result;
};

// Generate thumbnail for video/audio files
export const generateThumbnail = (publicId: string, time = "00:00:01") => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [
      { width: 300, height: 200, crop: "thumb" },
      { start_offset: time },
    ],
  });
};

// Get optimized URL for different use cases
export const getOptimizedUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {},
) => {
  return cloudinary.url(publicId, {
    transformation: [
      options.width && options.height
        ? { width: options.width, height: options.height, crop: "fill" }
        : {},
      options.quality ? { quality: options.quality } : {},
      options.format ? { format: options.format } : {},
    ].filter((t) => Object.keys(t).length > 0),
  });
};
