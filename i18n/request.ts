import { getRequestConfig } from "next-intl/server";

const locales = ["en", "es"];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, fallback to 'en' if not
  const validLocale = locales.includes(locale as string) ? locale : "en";

  return {
    locale: validLocale as string,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
