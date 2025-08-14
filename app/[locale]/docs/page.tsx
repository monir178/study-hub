"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DocsPage() {
  const t = useTranslations("docs");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const docSections = [
    {
      id: "user-guide",
      icon: BookOpen,
      title: t("categories.userGuide.title"),
      description: t("categories.userGuide.description"),
      content: [
        {
          subtitle: "Core Features Overview",
          content: [
            "StudyHub is a collaborative learning platform designed for students and educators.",
            "Key features include synchronized Pomodoro timers, real-time chat, collaborative notes, and study room management.",
            "All features work seamlessly across desktop, tablet, and mobile devices.",
            "The platform supports multiple authentication methods including Google, GitHub, and email.",
          ],
        },
        {
          subtitle: "Study Room System",
          content: [
            "Study rooms are the core of the platform where collaborative learning happens.",
            "Rooms can be public (visible to all users) or private (invite-only).",
            "Each room supports up to 50 concurrent users with real-time synchronization.",
            "Room moderators can manage members, set rules, and control access permissions.",
            "Rooms persist for the duration of the study session and can be archived when complete.",
          ],
        },
        {
          subtitle: "Pomodoro Timer Integration",
          content: [
            "Built-in Pomodoro timers help maintain focus and productivity.",
            "Timers automatically synchronize across all room members.",
            "Pre-configured intervals: 25/5 (classic), 45/15 (extended), and custom durations.",
            "Timer controls include start, pause, reset, and skip break options.",
            "Session statistics track study time and productivity metrics.",
          ],
        },
      ],
    },
    // {
    //   id: "api",
    //   icon: Code,
    //   title: t("categories.api.title"),
    //   description: t("categories.api.description"),
    //   content: [
    //     {
    //       subtitle: "REST API Endpoints",
    //       content: [
    //         "StudyHub provides a comprehensive REST API for integration.",
    //         "Base URL: https://api.studyhub.com/v1",
    //         "Authentication: Bearer token via Authorization header",
    //         "Rate limiting: 1000 requests per hour per API key",
    //         "All responses are in JSON format with standard HTTP status codes.",
    //       ],
    //     },
    //     {
    //       subtitle: "Core API Resources",
    //       content: [
    //         "GET /rooms - List available study rooms",
    //         "POST /rooms - Create a new study room",
    //         "GET /rooms/{id} - Get room details and members",
    //         "POST /rooms/{id}/join - Join a study room",
    //         "GET /rooms/{id}/chat - Retrieve chat messages",
    //         "POST /rooms/{id}/chat - Send a chat message",
    //         "GET /rooms/{id}/notes - Get room notes",
    //         "POST /rooms/{id}/notes - Create or update notes",
    //       ],
    //     },
    //     {
    //       subtitle: "WebSocket Events",
    //       content: [
    //         "Real-time updates via WebSocket connection",
    //         "Event types: user_joined, user_left, message_sent, timer_started, timer_ended",
    //         "Connection URL: wss://api.studyhub.com/ws",
    //         "Automatic reconnection with exponential backoff",
    //         "Event payload includes room ID, user ID, and relevant data.",
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: "integration",
    //   icon: Settings,
    //   title: t("categories.integration.title"),
    //   description: t("categories.integration.description"),
    //   content: [
    //     {
    //       subtitle: "LMS Integration",
    //       content: [
    //         "StudyHub integrates with popular Learning Management Systems.",
    //         "Supported platforms: Canvas, Moodle, Blackboard, Google Classroom",
    //         "Single Sign-On (SSO) support for seamless authentication.",
    //         "Automatic course and student roster synchronization.",
    //         "Grade passback capabilities for study session participation.",
    //       ],
    //     },
    //     {
    //       subtitle: "Calendar Integration",
    //       content: [
    //         "Sync study sessions with Google Calendar, Outlook, and Apple Calendar.",
    //         "Automatic event creation for scheduled study sessions.",
    //         "Reminder notifications before session start times.",
    //         "Calendar availability checking for optimal scheduling.",
    //         "Recurring session support for regular study groups.",
    //       ],
    //     },
    //     {
    //       subtitle: "Third-party Tools",
    //       content: [
    //         "Browser extensions for quick room access and notifications.",
    //         "Mobile apps for iOS and Android with full feature parity.",
    //         "Slack integration for team study coordination.",
    //         "Discord bot for community study sessions.",
    //         "Zapier integration for custom automation workflows.",
    //       ],
    //     },
    //   ],
    // },
    {
      id: "admin",
      icon: Users,
      title: t("categories.admin.title"),
      description: t("categories.admin.description"),
      content: [
        {
          subtitle: "User Management",
          content: [
            "Admin dashboard for comprehensive platform oversight.",
            "User account management: view, edit, suspend, or delete accounts.",
            "Role assignment: User, Moderator, Admin with granular permissions.",
            "Bulk user operations for large-scale account management.",
            "User activity monitoring and analytics dashboard.",
          ],
        },
        {
          subtitle: "Content Moderation",
          content: [
            "Real-time content monitoring across all study rooms.",
            "Automated flagging of inappropriate content or behavior.",
            "Manual review queue for flagged content and users.",
            "Custom moderation rules and automated actions.",
            "Reporting system for user-submitted concerns.",
          ],
        },
        {
          subtitle: "Platform Analytics",
          content: [
            "Comprehensive analytics on platform usage and engagement.",
            "Study session statistics: duration, participation, completion rates.",
            "User behavior analysis and retention metrics.",
            "Performance monitoring and system health indicators.",
            "Custom report generation and data export capabilities.",
          ],
        },
      ],
    },
  ];

  const quickStart = [
    t("quickStart.step1"),
    t("quickStart.step2"),
    t("quickStart.step3"),
    t("quickStart.step4"),
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t("quickStart.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {quickStart.map((step, index) => (
                <li key={index} className="text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Sections */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t("categories.title")}</h2>
        <div className="space-y-4">
          {docSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <Card
                key={section.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedSection(isExpanded ? null : section.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {section.description}
                  </p>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {section.content.map((content, index) => (
                        <div key={index}>
                          <h4 className="font-semibold text-foreground mb-3">
                            {content.subtitle}
                          </h4>
                          <ul className="space-y-2">
                            {content.content.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="text-muted-foreground"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t("resources.title")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">
                {t("resources.community.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("resources.community.description")}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/community">{t("resources.community.join")}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">
                {t("resources.examples.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("resources.examples.description")}
              </p>
              <p className="text-sm text-muted-foreground">
                Code examples and integration samples will be available soon.
                Check back for practical implementation guides.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("support.title")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("support.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/help">{t("support.helpCenter")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">{t("support.contactUs")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 pt-8 border-t text-center">
        <Link href="/" className="text-primary hover:underline font-medium">
          ← {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
