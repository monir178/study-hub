"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  BookOpen,
  Users,
  Clock,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  locale?: string;
  variant?: "landing" | "app";
}

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const landingNav: NavItem[] = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
];

const appNav: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: BookOpen },
  { name: "Rooms", href: "/rooms", icon: Users },
  { name: "Timer", href: "/timer", icon: Clock },
  { name: "Chat", href: "/chat", icon: MessageSquare },
];

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

export default function Navbar({
  locale = "en",
  variant = "landing",
}: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = variant === "app" ? appNav : landingNav;

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const toggleTheme = () => {
    if (mounted) {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <motion.nav
      initial={navbarAnimations.navbar.initial}
      animate={navbarAnimations.navbar.animate}
      transition={navbarAnimations.navbar.transition}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        variant === "app" || isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-2 group"
            >
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
              <NavLink key={item.name} href={item.href} label={item.name} />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 hover:bg-muted relative overflow-hidden"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.div>
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth Buttons */}
            {variant === "landing" ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/auth/signin`}>Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/${locale}/auth/signup`}>Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/profile`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/auth/signout`}>
                    <LogOut className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 relative overflow-hidden"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.div>
            </Button>

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
                        onClick={closeMenu}
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
                  {variant === "landing" ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        asChild
                      >
                        <Link
                          href={`/${locale}/auth/signin`}
                          onClick={closeMenu}
                        >
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link
                          href={`/${locale}/auth/signup`}
                          onClick={closeMenu}
                        >
                          Get Started
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        asChild
                      >
                        <Link href={`/${locale}/profile`} onClick={closeMenu}>
                          <Settings className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-center"
                        asChild
                      >
                        <Link
                          href={`/${locale}/auth/signout`}
                          onClick={closeMenu}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// Nav link component with animated underline
const NavLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground font-medium transition-colors relative group"
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
      </span>
    </Link>
  );
};
