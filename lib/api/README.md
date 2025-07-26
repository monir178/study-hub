# StudyHub API Client

This directory contains the API client setup for the StudyHub project, providing a centralized way to handle HTTP requests with automatic authentication and error handling.

## Features

- 🔐 **Automatic Authentication**: Integrates with NextAuth v5 to automatically include user session data
- 🛡️ **Error Handling**: Automatic handling of 401, 403, 429, and 5xx errors
- 📝 **TypeScript Support**: Full type safety with TypeScript interfaces
- 🔄 **Request/Response Interceptors**: Automatic request logging and error handling
- 🏗️ **Service Layer**: Organized API calls using service classes
- ⚡ **Developer Experience**: Comprehensive logging and debugging in development mode

## File Structure

```
lib/api/
├── index.ts                 # Main exports
├── client.ts               # API client implementation
├── types.ts                # Type definitions
├── services/
│   ├── index.ts           # Service exports
│   ├── user.service.ts    # User-related API calls
│   └── admin.service.ts   # Admin-related API calls
└── README.md              # This file
```

## Quick Start

### 1. Basic Usage

```typescript
import { apiClient } from "@/lib/api";

// Simple GET request
const users = await apiClient.get("/users");

// POST request with data
const newUser = await apiClient.post("/users", {
  name: "John Doe",
  email: "john@example.com",
});
```

### 2. Using Service Classes (Recommended)

```typescript
import { UserService, AdminService } from "@/lib/api/services";

// User operations
const users = await UserService.getUsers();
const user = await UserService.getUserById("123");
const profile = await UserService.getProfile();

// Admin operations
const stats = await AdminService.getDashboardStats();
const settings = await AdminService.getSystemSettings();
```

### 3. React Hook Usage

```typescript
import { useEffect, useState } from "react";
import { UserService } from "@/lib/api/services";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await UserService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // ... component JSX
}
```

## Authentication

The API client automatically handles authentication by:

1. **Session Integration**: Uses NextAuth v5 `auth()` function to get current session
2. **Request Headers**: Automatically adds user info to request headers:
   - `X-User-Id`: Current user's ID
   - `X-User-Email`: Current user's email
   - `X-User-Role`: Current user's role
3. **Error Handling**: Redirects to signin page on 401 errors

## Error Handling

The client automatically handles common HTTP errors:

- **401 Unauthorized**: Redirects to `/auth/signin`
- **403 Forbidden**: Redirects to `/unauthorized`
- **429 Rate Limited**: Logs warning message
- **500+ Server Errors**: Logs error message

## API Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

## Configuration

### Timeout

```typescript
import { apiClient } from "@/lib/api";

// Set 15-second timeout
apiClient.setTimeout(15000);
```

### Custom Headers

```typescript
// Add custom header
apiClient.setHeader("X-Custom-Header", "value");

// Remove header
apiClient.removeHeader("X-Custom-Header");
```

### Base URL

The API client uses `/api` as the base URL by default. You can get the current base URL:

```typescript
const baseURL = apiClient.getBaseURL();
```

## Development Features

- **Request Logging**: All requests are logged in development mode
- **Error Logging**: Detailed error information in console
- **Request Timing**: Automatic timestamp headers for debugging

## Adding New Services

To add a new service:

1. Create a new service file in `services/`
2. Define your types and service class
3. Export from `services/index.ts`

Example:

```typescript
// services/room.service.ts
import { apiClient } from "../client";

export interface Room {
  id: string;
  name: string;
  // ... other properties
}

export class RoomService {
  private static readonly BASE_PATH = "/rooms";

  static async getRooms(): Promise<Room[]> {
    return apiClient.get<Room[]>(this.BASE_PATH);
  }

  static async createRoom(data: CreateRoomData): Promise<Room> {
    return apiClient.post<Room>(this.BASE_PATH, data);
  }
}
```

## Migration from Fetch

If you're migrating from `fetch()` calls:

**Before:**

```typescript
const response = await fetch("/api/users");
const data = await response.json();
```

**After:**

```typescript
const data = await apiClient.get("/users");
// or
const data = await UserService.getUsers();
```

## Environment Variables

No additional environment variables are required. The client uses:

- NextAuth session for authentication
- `/api` as base URL (configurable)
- Development mode detection via `NODE_ENV`

## Best Practices

1. **Use Service Classes**: Prefer service classes over direct API client calls
2. **Handle Errors**: Always wrap API calls in try-catch blocks
3. **Type Safety**: Define proper TypeScript interfaces for your data
4. **Loading States**: Show loading indicators during API calls
5. **Error UI**: Display user-friendly error messages

## Contributing

When adding new API endpoints:

1. Add types to the appropriate service file
2. Add service methods with proper error handling
3. Update this README if needed
4. Test the integration thoroughly
