import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null; // ISO string instead of Date
  image: string | null;
  password: string | null;
  role: "USER" | "MODERATOR" | "ADMIN";
  locale: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";

  // Additional profile fields
  phoneNumber: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
  dateOfBirth: string | null; // ISO string instead of Date

  // Address fields
  street: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;

  createdAt: string; // ISO string instead of Date
  updatedAt: string; // ISO string instead of Date
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("/api/users");
  return response.json();
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: string; data: Partial<User> }) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
);

// Fetch current user profile with full details
export const fetchCurrentUserProfile = createAsyncThunk(
  "users/fetchCurrentUserProfile",
  async () => {
    const response = await fetch("/api/users/profile");
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return response.json();
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user profile";
      });
  },
});

export const {
  setCurrentUser,
  updateCurrentUser,
  clearCurrentUser,
  clearError,
} = usersSlice.actions;
export default usersSlice.reducer;
