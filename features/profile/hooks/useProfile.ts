import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { useDispatch } from "react-redux";
import { updateUser as updateAuthUser } from "@/features/auth/store/authSlice";
import { updateCurrentUser } from "@/features/users/store/usersSlice";
import {
  profileService,
  ProfileUpdateResponse,
} from "../services/profile.service";
import { UpdateUserData } from "@/features/users/types";
import { queryKeys } from "@/lib/query/keys";

export function useProfileUpdate() {
  const dispatch = useDispatch();
  const { invalidate } = useCacheUtils();

  return useApiMutation<ProfileUpdateResponse, UpdateUserData>({
    mutationFn: profileService.updateProfile,
    successMessage: "Profile updated successfully!",
    options: {
      onSuccess: (data) => {
        // Update auth store with proper type conversion
        const authUserUpdate = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || undefined,
          image: data.user.image || undefined,
          role: data.user.role,
        };
        dispatch(updateAuthUser(authUserUpdate));

        // Update current user in users store
        dispatch(updateCurrentUser(data.user));

        // Invalidate all user-related queries to refresh data everywhere
        invalidate(queryKeys.users);
        invalidate(queryKeys.userProfile());
        invalidate(queryKeys.user(data.user.id));
      },
    },
  });
}

export function useImageUpload() {
  return useApiMutation<{ imageUrl: string }, File>({
    mutationFn: profileService.uploadProfileImage,
    successMessage: "Image uploaded successfully!",
  });
}

export function useProfileWithImageUpdate() {
  const dispatch = useDispatch();
  const { invalidate } = useCacheUtils();

  return useApiMutation<
    ProfileUpdateResponse,
    { profileData: UpdateUserData; imageFile?: File }
  >({
    mutationFn: ({ profileData, imageFile }) =>
      profileService.updateProfileWithImage(profileData, imageFile),
    successMessage: "Profile updated successfully!",
    options: {
      onSuccess: (data) => {
        // Update auth store with proper type conversion
        const authUserUpdate = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || undefined,
          image: data.user.image || undefined,
          role: data.user.role,
        };
        dispatch(updateAuthUser(authUserUpdate));

        // Update current user in users store
        dispatch(updateCurrentUser(data.user));

        // Invalidate all user-related queries to refresh data everywhere
        invalidate(queryKeys.users);
        invalidate(queryKeys.userProfile());
        invalidate(queryKeys.user(data.user.id));
      },
    },
  });
}
