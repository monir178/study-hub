# Redux User State Management Guide

## Overview

This application now uses a comprehensive Redux-based user state management system that properly synchronizes NextAuth sessions with Redux store and provides global user state consistency.

## Architecture

### 1. Auth Slice (`features/auth/store/authSlice.ts`)

- Stores essential user authentication data (id, email, name, image, role)
- Tracks loading and error states
- Primary source for authentication status

### 2. Users Slice (`features/users/store/usersSlice.ts`)

- Stores complete user profile data including locale, theme, timestamps
- Manages users list for admin functionality
- Handles full user profile information

### 3. Session Synchronization (`lib/hooks/useSessionSync.ts`)

- Automatically syncs NextAuth session with Redux store
- Ensures Redux always has latest authentication state
- Handles login/logout state changes

## Usage Examples

### Basic User Data Access

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function UserProfile() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* user now includes locale, theme, etc. when available */}
      <p>Theme: {user?.theme}</p>
    </div>
  );
}
```

### Updating User Data Globally

```tsx
import { useUserUpdate } from "@/lib/hooks/useUserUpdate";

function EditProfile() {
  const { updateUser, isLoading } = useUserUpdate();

  const handleUpdateProfile = async () => {
    try {
      await updateUser({
        name: "New Name",
        theme: "DARK",
        locale: "es",
        phoneNumber: "+1234567890",
        city: "New York",
        country: "US",
      });
      // User data is now updated globally across the app
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <button onClick={handleUpdateProfile} disabled={isLoading}>
      {isLoading ? "Updating..." : "Update Profile"}
    </button>
  );
}
```

### Complete Profile Management Page

The application includes a comprehensive profile management page at `/[locale]/dashboard/profile` that demonstrates the full user state management system:

```tsx
// The profile page includes:
// - Profile picture upload with Cloudinary integration
// - Personal information form (name, phone, gender, date of birth)
// - Address information form (street, city, region, postal code, country)
// - Real-time Redux state updates
// - Mobile-responsive design
// - Full type safety with Prisma schema alignment

// Access the profile page at: /en/dashboard/profile
```

### Direct Redux Access (Advanced)

```tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { updateCurrentUser } from "@/features/users/store/usersSlice";

function AdvancedUserComponent() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );

  // Direct Redux update (use sparingly - prefer useUserUpdate)
  const handleDirectUpdate = () => {
    dispatch(updateCurrentUser({ theme: "LIGHT" }));
  };

  return (
    <div>
      <p>Auth User: {authUser?.name}</p>
      <p>Full User: {currentUser?.name}</p>
      <p>Theme: {currentUser?.theme}</p>
    </div>
  );
}
```

## Key Benefits

1. **Global Consistency**: User data updates are reflected immediately across all components
2. **Automatic Sync**: NextAuth session changes automatically update Redux store
3. **Optimistic Updates**: UI updates immediately while API call happens in background
4. **Type Safety**: Full TypeScript support with proper type definitions
5. **Centralized State**: Single source of truth for user data

## Implementation Details

### Session Sync Provider

The `SessionSyncProvider` is automatically included in the app's provider tree and handles:

- Monitoring NextAuth session changes
- Updating Redux store when user signs in/out
- Fetching complete user profile when needed

### Redux Store Structure

```typescript
// store.auth
{
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: "USER" | "MODERATOR" | "ADMIN";
  } | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// store.users
{
  currentUser: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role: "USER" | "MODERATOR" | "ADMIN";
    locale: string;
    theme: "LIGHT" | "DARK" | "SYSTEM";
    createdAt: string;
    updatedAt: string;
  } | null;
  users: User[]; // For admin user management
  loading: boolean;
  error: string | null;
}
```

### Data Flow

1. User signs in via NextAuth
2. `useSessionSync` detects session change
3. Updates both `auth` and `users` slices in Redux
4. Fetches complete user profile if needed
5. All components using `useAuth` get updated data immediately

### Error Handling

The system includes comprehensive error handling:

- API failures during updates
- Session synchronization errors
- Optimistic update rollbacks on failure

## Migration Guide

If you're updating existing components:

1. Replace direct NextAuth session usage with `useAuth`
2. Use `useUserUpdate` instead of direct API calls for profile updates
3. Remove manual Redux dispatches for user data (use hooks instead)
4. Update component prop types to use the unified user interface

## Best Practices

1. **Use `useAuth`** for accessing user data in components
2. **Use `useUserUpdate`** for updating user profile data
3. **Avoid direct Redux dispatches** unless absolutely necessary
4. **Handle loading states** properly in your components
5. **Use TypeScript types** provided by the system
