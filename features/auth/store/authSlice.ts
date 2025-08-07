import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Use a simplified Auth User interface for the auth slice
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: "USER" | "MODERATOR" | "ADMIN";
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Track if auth state has been initialized
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.error = null;
      state.isInitialized = true;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      state.isInitialized = true;
    },
  },
});

export const { setUser, updateUser, setLoading, setError, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
