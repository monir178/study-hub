import Link from "next/link";

interface FooterProps {
  locale?: string;
}

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "/dashboard/rooms", label: "Study Rooms" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#about", label: "About" },
      { href: "#contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/docs", label: "Documentation" },
      { href: "/community", label: "Community" },
    ],
  },
];

export default function Footer({ locale = "en" }: FooterProps) {
  return (
    <footer className="border-t py-12 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">StudyHub</span>
            </div>
            <p className="text-muted-foreground">
              The ultimate collaborative learning platform for students
              worldwide.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={
                        link.href.startsWith("/")
                          ? `/${locale}${link.href}`
                          : link.href
                      }
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2024 StudyHub. Built with Next.js, Tailwind CSS, and ❤️. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
