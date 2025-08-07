"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Users,
  FileText,
  User,
  BarChart3,
  Home,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
}

export function AppSidebar() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  // Don't render sidebar on public pages or if not authenticated
  if (
    !isAuthenticated ||
    !user ||
    !pathname ||
    pathname === "/" ||
    pathname.includes("/auth/")
  ) {
    return null;
  }

  // Get navigation items based on user role with translations
  const getNavItems = (): NavItem[] => {
    switch (user.role) {
      case "ADMIN":
        return [
          { name: t("dashboard"), href: "/dashboard", icon: Home },
          { name: t("users"), href: "/dashboard/users", icon: Users },
          {
            name: t("sessions"),
            href: "/dashboard?tab=sessions",
            icon: Calendar,
          },
          {
            name: t("content"),
            href: "/dashboard?tab=content",
            icon: FileText,
          },
          {
            name: t("analytics"),
            href: "/dashboard?tab=analytics",
            icon: BarChart3,
          },
          {
            name: t("settings"),
            href: "/dashboard?tab=settings",
            icon: Settings,
          },
        ];
      case "MODERATOR":
        return [
          { name: t("dashboard"), href: "/dashboard", icon: Home },
          { name: t("users"), href: "/dashboard/users", icon: Users },
          { name: t("studyRooms"), href: "/dashboard/rooms", icon: BookOpen },
          {
            name: t("analytics"),
            href: "/dashboard?tab=analytics",
            icon: BarChart3,
          },
        ];
      case "USER":
      default:
        return [
          { name: t("dashboard"), href: "/dashboard", icon: Home },
          { name: t("studyRooms"), href: "/dashboard/rooms", icon: Users },
          { name: t("publicNotes"), href: "/dashboard/notes", icon: FileText },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "USER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Sidebar variant="inset">
      <Link href="/">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">SH</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">StudyHub</span>
              <span className="truncate text-xs text-muted-foreground">
                {t("collaborativeLearning")}
              </span>
            </div>
          </div>
        </SidebarHeader>
      </Link>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                  <Link href="/dashboard/profile">
                    <User className="h-4 w-4" />
                    <span>{t("profile")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>{t("settings")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("preferences")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    if (theme === "light") {
                      setTheme("dark");
                    } else if (theme === "dark") {
                      setTheme("system");
                    } else {
                      setTheme("light");
                    }
                  }}>
                  {theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                  <span>
                    Theme:{" "}
                    {theme === "light"
                      ? "Light"
                      : theme === "dark"
                        ? "Dark"
                        : "System"}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    if (confirm(t("signOutConfirm"))) {
                      signOut({ callbackUrl: "/" });
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("signOut")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/profile">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.name || "User"}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                  {user.role}
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
