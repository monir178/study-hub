import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type UserRole = "USER" | "MODERATOR" | "ADMIN";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication required",
          },
          { status: 401 },
        );
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name || undefined,
        role: session.user.role as UserRole,
      };

      return handler(req as AuthenticatedRequest);
    } catch (error) {
      console.error("Authentication middleware error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
        },
        { status: 401 },
      );
    }
  };
}

export function withRole(
  roles: UserRole[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (!roles.includes(req.user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient permissions",
          required: roles,
          current: req.user.role,
        },
        { status: 403 },
      );
    }

    return handler(req);
  });
}

// Convenience functions for specific roles
export const withAdmin = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) => withRole(["ADMIN"], handler);

export const withModerator = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) => withRole(["ADMIN", "MODERATOR"], handler);

export const withUser = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) => withRole(["ADMIN", "MODERATOR", "USER"], handler);
