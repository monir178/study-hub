"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import Navbar from "@/features/shared/components/Navbar";
import LanguageSelector from "@/features/shared/components/LanguageSelector";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ThemeToggleButton from "../ui/theme-toggle-button";

interface MainLayoutProps {
  children: ReactNode;
  locale?: string;
}

export function MainLayout({ children, locale = "en" }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if we're on a public page (handle locale prefixes)
  const pathWithoutLocale = pathname.startsWith(`/${locale}`)
    ? pathname.slice(`/${locale}`.length) || "/"
    : pathname;

  const isPublicPage =
    pathWithoutLocale === "/" ||
    pathWithoutLocale.startsWith("/auth/") ||
    pathWithoutLocale.startsWith("/about") ||
    pathWithoutLocale.startsWith("/features") ||
    pathWithoutLocale.startsWith("/pricing");

  // Generate breadcrumbs
  const generateBreadcrumbs = (): Array<{
    name: string;
    href: string;
    isLast: boolean;
  }> => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{ name: string; href: string; isLast: boolean }> =
      [];

    // Remove locale from path if present
    const segments =
      pathSegments[0] === locale ? pathSegments.slice(1) : pathSegments;

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;

      // Skip "dashboard" segment since we handle it separately
      if (segment === "dashboard") {
        return;
      }

      // Capitalize and format segment name
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        name,
        href,
        isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // For public pages, just render navbar and content
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar key={`navbar-${locale}`} locale={locale} />
        <main className="pt-16">{children}</main>
      </div>
    );
  }

  // For authenticated app pages, render with sidebar
  if (session) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {breadcrumbs.length > 0 && (
                <Breadcrumb>
                  <BreadcrumbList>
                    {/* Only show Dashboard link if we're not on the dashboard page */}
                    {pathname !== "/dashboard" &&
                      pathname !== `/${locale}/dashboard` && (
                        <>
                          <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/dashboard">
                              Dashboard
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator className="hidden md:block" />
                        </>
                      )}
                    {breadcrumbs.map((breadcrumb, index) => (
                      <div key={breadcrumb.href} className="flex items-center">
                        {/* Only show separator if it's not the first item or if Dashboard was shown */}
                        {index > 0 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        <BreadcrumbItem>
                          {breadcrumb.isLast ? (
                            <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href}>
                              {breadcrumb.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
            <div className="flex items-center gap-2 px-4">
              <LanguageSelector variant="compact" showLabel={false} />
              <ThemeToggleButton variant="circle-blur" start="top-right" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback for unauthenticated users on protected pages
  return (
    <div className="min-h-screen bg-background">
      <Navbar key={`navbar-fallback-${locale}`} locale={locale} />
      <main className="pt-16">{children}</main>
    </div>
  );
}
