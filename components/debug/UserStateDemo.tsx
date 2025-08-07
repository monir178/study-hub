"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks";
import { useUpdateProfile } from "@/features/users/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

/**
 * Demo component showing how user data updates globally across the app
 * This component can be placed anywhere in the app to test user state management
 */
export function UserStateDemo() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { mutateAsync: updateUser, isPending: updateLoading } =
    useUpdateProfile();

  // Type guard to ensure we have a full User object
  const fullUser = user && "theme" in user ? user : null;

  const [name, setName] = useState(fullUser?.name || "");
  const [theme, setTheme] = useState(fullUser?.theme || "SYSTEM");
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Please sign in to test user state management.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (authLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading user data...</p>
        </CardContent>
      </Card>
    );
  }

  const handleUpdate = async () => {
    try {
      setSuccess(false);
      await updateUser({
        name: name || undefined,
        theme: theme as "LIGHT" | "DARK" | "SYSTEM",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User State Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!fullUser && user && (
          <Alert>
            <AlertDescription>
              Only basic user info available from session. Full profile is
              loading...
            </AlertDescription>
          </Alert>
        )}

        {/* Current User Data Display */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Current User Data:</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>ID:</strong> {user?.id}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Name:</strong> {user?.name || "Not set"}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Theme:</strong> {fullUser?.theme || "Not set"}
            </p>
            <p>
              <strong>Locale:</strong> {fullUser?.locale || "Not set"}
            </p>
            <p>
              <strong>Phone:</strong> {fullUser?.phoneNumber || "Not set"}
            </p>
            <p>
              <strong>Gender:</strong> {fullUser?.gender || "Not set"}
            </p>
            <p>
              <strong>City:</strong> {fullUser?.city || "Not set"}
            </p>
            <p>
              <strong>Country:</strong> {fullUser?.country || "Not set"}
            </p>
          </div>
        </div>

        {/* Update Form */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={theme}
              onValueChange={(value) =>
                setTheme(value as "LIGHT" | "DARK" | "SYSTEM")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIGHT">Light</SelectItem>
                <SelectItem value="DARK">Dark</SelectItem>
                <SelectItem value="SYSTEM">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={updateLoading || !fullUser}
            className="w-full"
          >
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>

          {success && (
            <Alert>
              <AlertDescription>
                Profile updated successfully! Check the user data above - it
                should update immediately. Also check the navbar and any other
                components showing user info.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            This demo shows how user data updates globally across the app using
            Redux.
          </p>
          <p>
            Changes should be reflected immediately in all components using
            useAuth().
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
