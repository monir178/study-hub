import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Handle internationalization
  const response = intlMiddleware(request);

  // Handle authentication for protected routes
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protected routes (handle locale prefixes)
  const protectedRoutes = ["/dashboard", "/profile"];
  const pathWithoutLocale = pathname.startsWith("/en/")
    ? pathname.slice(3)
    : pathname.startsWith("/es/")
      ? pathname.slice(3)
      : pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route),
  );

  if (isProtectedRoute && !session) {
    return Response.redirect(new URL("/auth/signin", request.url));
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
