import { apiClient } from "@/lib/api/client";
import { User, UpdateUserData } from "@/features/users/types";

export interface ProfileUpdateResponse {
  user: User;
}

export interface ImageUploadResponse {
  imageUrl: string;
}

export const profileService = {
  // Update user profile
  updateProfile: async (
    data: UpdateUserData,
  ): Promise<ProfileUpdateResponse> => {
    return apiClient.patch<ProfileUpdateResponse>("/users/profile", data);
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<ImageUploadResponse>("/upload/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update profile with image
  updateProfileWithImage: async (
    profileData: UpdateUserData,
    imageFile?: File,
  ): Promise<ProfileUpdateResponse> => {
    let imageUrl: string | undefined;

    // Upload image first if provided
    if (imageFile) {
      const imageResponse = await profileService.uploadProfileImage(imageFile);
      imageUrl = imageResponse.imageUrl;
    }

    // Update profile with image URL
    const updateData = {
      ...profileData,
      ...(imageUrl && { image: imageUrl }),
    };

    return profileService.updateProfile(updateData);
  },
};
