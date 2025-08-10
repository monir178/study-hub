"use client";

import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutDialog } from "./SignOutDialog";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePersistentAnimation } from "@/lib/hooks/usePersistentAnimation";
import LanguageSelector from "./LanguageSelector";
import { BookOpen, LogOut, User, Shield } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Animation variants
const navbarAnimations = {
  navbar: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 },
  },
  mobileMenu: {
    initial: { opacity: 0, y: -20, scaleY: 0 },
    animate: { opacity: 1, y: 0, scaleY: 1 },
    exit: { opacity: 0, y: -20, scaleY: 0 },
    transition: { duration: 0.3 },
  },
  mobileMenuItem: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [signOutDialog, setSignOutDialog] = useState({
    isOpen: false,
    isSigningOut: false,
  });
  const { user, isAuthenticated } = useAuth();

  const { initial, animate } = usePersistentAnimation({
    animationKey: "navbar",
    resetOnLocaleChange: false,
    resetOnRouteChange: false,
  });

  const t = useTranslations("navbar");
  const tAuth = useTranslations("auth");
  const tProfile = useTranslations("profile");

  // Create nav items with translations
  const landingNavItems: NavItem[] = [
    { name: t("home"), href: "/" },
    { name: t("features"), href: "#features" },
    { name: t("about"), href: "#about" },
  ];

  const appNavItems: NavItem[] = [
    { name: t("home"), href: "/" },
    { name: t("features"), href: "#features" },
    { name: t("about"), href: "#about" },
    { name: t("dashboard"), href: "/dashboard", icon: BookOpen },
  ];

  // Determine which nav items to show based on authentication
  const navItems = isAuthenticated ? appNavItems : landingNavItems;

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Handle sign out with loading state
  const handleSignOut = async () => {
    setSignOutDialog((prev) => ({ ...prev, isSigningOut: true }));
    try {
      await signOut({ callbackUrl: "/" });
      // Dialog will close automatically when the page redirects
    } catch (error) {
      console.error("Sign out error:", error);
      // Reset the signing out state if there's an error
      setSignOutDialog((prev) => ({ ...prev, isSigningOut: false }));
    }
  };

  // Handle smooth scrolling to sections
  const handleSmoothScroll = (href: string) => {
    // Check if it's a hash link (section scroll)
    if (href.startsWith("#")) {
      const targetElement = document.querySelector(href) as HTMLElement;
      if (targetElement) {
        // Use custom smooth scrolling
        const targetPosition = targetElement.offsetTop - 80; // Account for navbar height
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200; // 1.2 seconds
        let start: number | null = null;

        const easeOutExpo = (t: number): number => {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const animateScroll = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const easeProgress = easeOutExpo(progress);

          window.scrollTo(0, startPosition + distance * easeProgress);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }
      return true; // Indicate that we handled the scroll
    }
    return false; // Let the Link component handle regular navigation
  };

  return (
    <motion.nav
      initial={initial}
      animate={animate}
      transition={navbarAnimations.navbar.transition}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isAuthenticated || isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-sm">
                  S
                </span>
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                StudyHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                label={item.name}
                onSmoothScroll={handleSmoothScroll}
              />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector variant="compact" showLabel={false} />

            {/* Theme Toggle */}
            <ThemeToggleButton variant="circle-blur" start="top-right" />

            {/* Auth Buttons / User Menu */}
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">{tAuth("signIn")}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">{t("getStarted")}</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || "User"}
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <AvatarFallback>
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : user?.email?.[0].toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{tProfile("title")}</span>
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/users">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>{t("adminPanel")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSignOutDialog((prev) => ({ ...prev, isOpen: true }));
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("signOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector variant="compact" showLabel={false} />

            <ThemeToggleButton variant="circle-blur" start="top-right" />

            <button
              onClick={toggleMenu}
              className="focus:outline-none transition-colors duration-300 text-foreground hover:text-primary relative w-6 h-6"
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                {/* Top line */}
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-500 ease-[0.4,0,0.2,1] ${
                    isMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1"
                  }`}
                />
                {/* Middle line */}
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-500 ease-[0.4,0,0.2,1] ${
                    isMenuOpen
                      ? "opacity-0 scale-x-0"
                      : "opacity-100 scale-x-100"
                  }`}
                />
                {/* Bottom line */}
                <div
                  className={`w-5 h-0.5 bg-current transition-all duration-500 ease-[0.4,0,0.2,1] ${
                    isMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg origin-top"
              initial={{ opacity: 0, y: -20, scaleY: 0 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -20, scaleY: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="px-4 py-6 space-y-4 flex flex-col justify-center items-center">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        href={item.href}
                        className="px-4 py-3 font-semibold transition-all duration-300 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted w-full text-center flex items-center justify-center space-x-3"
                        onClick={(e) => {
                          // Handle smooth scroll for hash links
                          if (handleSmoothScroll(item.href)) {
                            e.preventDefault();
                          }
                          closeMenu();
                        }}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Actions */}
                <motion.div
                  className="pt-4 w-full space-y-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                    delay: navItems.length * 0.05,
                  }}
                >
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        asChild
                      >
                        <Link href="/auth/signin" onClick={closeMenu}>
                          {tAuth("signIn")}
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/auth/signup" onClick={closeMenu}>
                          {t("getStarted")}
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user?.image || ""}
                            alt={user?.name || "User"}
                            onError={(e) => {
                              console.error(
                                "Failed to load mobile avatar image:",
                                user?.image,
                              );
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <AvatarFallback>
                            {user?.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : user?.email?.[0].toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/dashboard/profile" onClick={closeMenu}>
                          <User className="h-4 w-4 mr-2" />
                          {tProfile("title")}
                        </Link>
                      </Button>
                      {/* <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild>
                        <Link href="/settings" onClick={closeMenu}>
                          <Settings className="h-4 w-4 mr-2" />
                          {tSettings("title")}
                        </Link>
                      </Button> */}
                      {user?.role === "ADMIN" && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href="/dashboard/users" onClick={closeMenu}>
                            <Shield className="h-4 w-4 mr-2" />
                            {t("adminPanel")}
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                        onClick={() => {
                          closeMenu();
                          setSignOutDialog((prev) => ({
                            ...prev,
                            isOpen: true,
                          }));
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("signOut")}
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sign Out Dialog */}
      <SignOutDialog
        state={signOutDialog}
        onOpenChange={(open) =>
          setSignOutDialog((prev) => ({ ...prev, isOpen: open }))
        }
        onSignOut={handleSignOut}
      />
    </motion.nav>
  );
}

// Nav link component with animated underline and smooth scrolling
const NavLink = ({
  href,
  label,
  onSmoothScroll,
}: {
  href: string;
  label: string;
  onSmoothScroll: (href: string) => boolean;
}) => {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground font-medium transition-colors relative group"
      onClick={(e) => {
        // Handle smooth scroll for hash links
        if (onSmoothScroll(href)) {
          e.preventDefault();
        }
      }}
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
      </span>
    </Link>
  );
};
