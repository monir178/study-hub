"use client";

import { useFormContext } from "react-hook-form";
import { getData } from "country-list";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/features/users/types";
import { ProfileFormData } from "@/features/profile/types";

// Get all countries from country-list package
const COUNTRIES = getData();

interface PersonalAddressProps {
  user: User;
}

export function PersonalAddress({ user: _user }: PersonalAddressProps) {
  const form = useFormContext<ProfileFormData>();
  const t = useTranslations("profile.form");

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      data-testid="personal-address"
    >
      {/* Street */}
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem className="lg:col-span-2" data-testid="street-field">
            <FormLabel data-testid="street-label">{t("street")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("streetPlaceholder")}
                {...field}
                data-testid="street-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem data-testid="city-field">
            <FormLabel data-testid="city-label">{t("city")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("cityPlaceholder")}
                {...field}
                data-testid="city-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Region */}
      <FormField
        control={form.control}
        name="region"
        render={({ field }) => (
          <FormItem data-testid="region-field">
            <FormLabel data-testid="region-label">{t("region")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("regionPlaceholder")}
                {...field}
                data-testid="region-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={form.control}
        name="postalCode"
        render={({ field }) => (
          <FormItem data-testid="postal-code-field">
            <FormLabel data-testid="postal-code-label">
              {t("postalCode")}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t("postalCodePlaceholder")}
                {...field}
                data-testid="postal-code-input"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem data-testid="country-field">
            <FormLabel data-testid="country-label">{t("country")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              key={`country-${field.value || "empty"}`}
            >
              <FormControl>
                <SelectTrigger data-testid="country-select">
                  <SelectValue placeholder={t("countryPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60">
                {COUNTRIES.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.name}
                    data-testid={`country-option-${country.name}`}
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
