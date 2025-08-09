"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
];

interface LanguageSelectorProps {
  variant?: "default" | "compact";
  showLabel?: boolean;
  locale?: string;
}

export default function LanguageSelector({
  variant = "default",
  showLabel = true,
  locale: _propLocale,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use the standard next-intl approach
  const locale = useLocale();

  const t = useTranslations("common");

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Preserve search parameters when changing locale
      const searchParamsString = searchParams.toString();
      const fullPath = searchParamsString
        ? `${pathname}?${searchParamsString}`
        : pathname;

      // Use the official next-intl navigation API
      // This automatically handles locale prefixes
      router.replace(fullPath, { locale: newLocale });
      setIsOpen(false);
    });
  };

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 hover:bg-muted relative overflow-hidden"
            disabled={isPending}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isPending ? 0.9 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <span className="text-lg">{currentLanguage.flag}</span>
            </motion.div>
            <span className="sr-only">{t("selectLanguage")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
              disabled={isPending}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm">{language.nativeName}</span>
              </div>
              {language.code === locale && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 hover:bg-muted relative overflow-hidden"
          disabled={isPending}
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isPending ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <span className="text-lg">{currentLanguage.flag}</span>
            {showLabel && (
              <span className="text-sm font-medium hidden sm:inline">
                {currentLanguage.nativeName}
              </span>
            )}
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 text-white ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </motion.div>
          <span className="sr-only">{t("selectLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <AnimatePresence>
          {languages.map((language, index) => (
            <motion.div
              key={language.code}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
              }}
            >
              <DropdownMenuItem
                onClick={() => handleLanguageChange(language.code)}
                className="flex items-center justify-between cursor-pointer py-3"
                disabled={isPending}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {language.name}
                    </span>
                  </div>
                </div>
                {language.code === locale && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </DropdownMenuItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
