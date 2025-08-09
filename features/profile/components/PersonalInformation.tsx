"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { User } from "@/features/users/types";
import { ProfileFormData } from "@/features/profile/types";

interface PersonalInformationProps {
  user: User;
}

export function PersonalInformation({ user: _user }: PersonalInformationProps) {
  const form = useFormContext<ProfileFormData>();
  const t = useTranslations("profile.form");

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      data-testid="personal-information"
    >
      {/* Gender */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem data-testid="gender-field">
            <FormLabel data-testid="gender-label">{t("gender")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              key={`gender-${field.value || "empty"}`}
            >
              <FormControl>
                <SelectTrigger data-testid="gender-select">
                  <SelectValue placeholder={t("genderPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MALE" data-testid="gender-option-male">
                  {t("genderOptions.male")}
                </SelectItem>
                <SelectItem value="FEMALE" data-testid="gender-option-female">
                  {t("genderOptions.female")}
                </SelectItem>
                <SelectItem value="OTHER" data-testid="gender-option-other">
                  {t("genderOptions.other")}
                </SelectItem>
                <SelectItem
                  value="PREFER_NOT_TO_SAY"
                  data-testid="gender-option-prefer-not-to-say"
                >
                  {t("genderOptions.preferNotToSay")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date of Birth */}
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem data-testid="date-of-birth-field">
            <FormLabel data-testid="date-of-birth-label">
              {t("dateOfBirth")}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                    data-testid="date-of-birth-button"
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{t("dateOfBirthPlaceholder")}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  data-testid="date-calendar"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
