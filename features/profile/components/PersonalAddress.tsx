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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Street */}
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel>{t("street")}</FormLabel>
            <FormControl>
              <Input placeholder={t("streetPlaceholder")} {...field} />
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
          <FormItem>
            <FormLabel>{t("city")}</FormLabel>
            <FormControl>
              <Input placeholder={t("cityPlaceholder")} {...field} />
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
          <FormItem>
            <FormLabel>{t("region")}</FormLabel>
            <FormControl>
              <Input placeholder={t("regionPlaceholder")} {...field} />
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
          <FormItem>
            <FormLabel>{t("postalCode")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t("postalCodePlaceholder")}
                {...field}
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
          <FormItem>
            <FormLabel>{t("country")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              key={`country-${field.value || "empty"}`}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("countryPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
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
