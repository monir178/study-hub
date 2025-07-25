/**
 * Jest Setup Validation Tests
 * Tests to validate Jest configuration, environment, and mocks
 */

describe("Jest Configuration Validation", () => {
  test("Jest loads correctly", () => {
    expect(true).toBe(true);
  });

  test("jsdom environment is available", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
    expect(typeof document.createElement).toBe("function");
  });

  test("testing-library/jest-dom matchers are available", () => {
    const div = document.createElement("div");
    div.textContent = "Hello World";
    document.body.appendChild(div);

    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent("Hello World");
  });
});

describe("Mock Validation", () => {
  test("Next.js navigation mocks work", () => {
    const {
      useRouter,
      useSearchParams,
      usePathname,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require("next/navigation");

    const router = useRouter();
    expect(typeof router.push).toBe("function");
    expect(typeof router.replace).toBe("function");
    expect(typeof router.prefetch).toBe("function");

    const searchParams = useSearchParams();
    expect(searchParams).toBeInstanceOf(URLSearchParams);

    const pathname = usePathname();
    expect(typeof pathname).toBe("string");
  });

  test("NextAuth mocks work", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useSession, signIn, signOut } = require("next-auth/react");

    const session = useSession();
    expect(session).toHaveProperty("data");
    expect(session).toHaveProperty("status");
    expect(session.status).toBe("unauthenticated");

    expect(typeof signIn).toBe("function");
    expect(typeof signOut).toBe("function");
  });

  test("Socket.IO mocks work", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { io } = require("socket.io-client");

    const socket = io();
    expect(typeof socket.on).toBe("function");
    expect(typeof socket.off).toBe("function");
    expect(typeof socket.emit).toBe("function");
    expect(typeof socket.disconnect).toBe("function");
  });

  test("next-intl mocks work", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useTranslations, useLocale } = require("next-intl");

    const t = useTranslations();
    expect(typeof t).toBe("function");
    expect(t("test.key")).toBe("test.key");

    const locale = useLocale();
    expect(locale).toBe("en");
  });

  test("framer-motion mocks work", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { motion, AnimatePresence } = require("framer-motion");

    expect(motion.div).toBe("div");
    expect(motion.span).toBe("span");
    expect(motion.button).toBe("button");
    expect(typeof AnimatePresence).toBe("function");
  });
});
