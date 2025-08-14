"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Contact() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact form validation schema
  const contactFormSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required").max(1000),
    message: z.string().max(1000).optional(),
  });

  type ContactFormData = z.infer<typeof contactFormSchema>;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t("methods.email.title"),
      description: t("methods.email.description"),
      value: "monir.mzs17@gmail.com",
      href: "mailto:monir.mzs17@gmail.com",
    },
    {
      icon: MessageSquare,
      title: t("methods.support.title"),
      description: t("methods.support.description"),
      value: t("methods.support.responseTime"),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t("form.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.firstName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.firstNamePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.lastName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.lastNamePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("form.emailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.subject")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.subjectPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.message")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("form.messagePlaceholder")}
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : t("form.sendMessage")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t("getInTouch")}</h2>
            <p className="text-muted-foreground mb-8">
              {t("getInTouchDescription")}
            </p>
          </div>

          <div className="space-y-4">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{method.title}</h3>
                        <p className="text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        {method.href ? (
                          <a
                            href={method.href}
                            className="text-primary hover:underline font-medium"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className="font-medium">{method.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>{t("quickLinks.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link
                  href="/help"
                  className="block text-primary hover:underline"
                >
                  {t("quickLinks.helpCenter")}
                </Link>
                <Link
                  href="/docs"
                  className="block text-primary hover:underline"
                >
                  {t("quickLinks.documentation")}
                </Link>
                <Link
                  href="/community"
                  className="block text-primary hover:underline"
                >
                  {t("quickLinks.community")}
                </Link>
                <Link
                  href="/privacy"
                  className="block text-primary hover:underline"
                >
                  {t("quickLinks.privacy")}
                </Link>
                <Link
                  href="/terms"
                  className="block text-primary hover:underline"
                >
                  {t("quickLinks.terms")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t text-center">
        <Link href="/" className="text-primary hover:underline font-medium">
          ← {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
