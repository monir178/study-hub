import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "";
  },
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useLocale: () => "en",
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
    button: "button",
  },
  AnimatePresence: ({ children }) => children,
}));
