import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const uploadImage = async (file: File, folder = "studyhub") => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto:good" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
};

export const deleteImage = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};
