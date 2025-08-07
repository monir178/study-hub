import { z } from "zod";

export interface ProfileSectionProps {
  isPending?: boolean;
}

export interface ImageUploadResponse {
  url: string;
  publicId: string;
}

// Profile form schema - matches Prisma User model exactly
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  dateOfBirth: z.date().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
