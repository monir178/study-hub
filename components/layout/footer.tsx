"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { Github, Mail } from "lucide-react";

interface FooterProps {
  locale?: string;
}

const footerLinks = {
  product: [
    { name: "Study Rooms", href: "/dashboard/rooms" },
    { name: "Documentation", href: "/docs" },
  ],
  company: [{ name: "Contact", href: "/contact" }],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
  ],
};

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/monir178/study-hub",
    icon: Github,
  },
  { name: "Email", href: "mailto:monir.mzs17@gmail.com", icon: Mail },
];

export function Footer({ locale: _locale = "en" }: FooterProps) {
  const pathname = usePathname();

  // Don't show footer on app pages (authenticated pages)
  const isAppPage =
    pathname.includes("/dashboard") ||
    pathname.includes("/dashboard/rooms") ||
    pathname.includes("/profile") ||
    pathname.includes("/settings") ||
    pathname.includes("/admin");

  if (isAppPage) {
    return null;
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-6">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">SH</span>
              </div>
              <span className="text-lg font-bold">StudyHub</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Collaborative learning platform for students worldwide.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-6">
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} StudyHub</span>
            <div className="flex items-center gap-4">
              <span>
                Developed by{" "}
                <a
                  href="https://www.monir178.live/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Moniruzzaman Monir
                </a>
              </span>
              <a
                href="https://github.com/monir178/study-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <Github className="h-4 w-4" />
                Star
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
