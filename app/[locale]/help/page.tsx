"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Clock,
  MessageSquare,
  FileText,
  Settings,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const t = useTranslations("help");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const helpSections = [
    {
      id: "getting-started",
      icon: BookOpen,
      title: t("categories.gettingStarted.title"),
      description: t("categories.gettingStarted.description"),
      content: [
        {
          subtitle: "Creating Your Account",
          steps: [
            "Click the 'Sign Up' button in the top navigation",
            "Choose to sign up with Google, GitHub, or email",
            "Fill in your details and create a strong password",
            "Verify your email address if using email signup",
            "Complete your profile with your name and preferences",
          ],
        },
        {
          subtitle: "Your First Study Session",
          steps: [
            "Navigate to the Dashboard after signing in",
            "Click 'Create Room' to start a new study session",
            "Set a room name and choose privacy settings",
            "Invite friends using the room code or direct link",
            "Start your first synchronized Pomodoro timer",
          ],
        },
      ],
    },
    {
      id: "study-rooms",
      icon: Users,
      title: t("categories.studyRooms.title"),
      description: t("categories.studyRooms.description"),
      content: [
        {
          subtitle: "Creating Study Rooms",
          steps: [
            "From the dashboard, click 'Create Room'",
            "Enter a descriptive room name",
            "Choose between Public or Private room",
            "Set room description and tags",
            "Configure member permissions if needed",
          ],
        },
        {
          subtitle: "Joining Study Rooms",
          steps: [
            "Browse public rooms from the dashboard",
            "Use room codes shared by friends",
            "Click on any room to join instantly",
            "Request access for private rooms",
            "Wait for approval from room moderators",
          ],
        },
        {
          subtitle: "Room Management",
          steps: [
            "Use the room settings to manage members",
            "Assign moderator roles to trusted members",
            "Set room rules and guidelines",
            "Monitor activity and moderate content",
            "Archive or delete rooms when finished",
          ],
        },
      ],
    },
    {
      id: "timers",
      icon: Clock,
      title: t("categories.timers.title"),
      description: t("categories.timers.description"),
      content: [
        {
          subtitle: "Using Pomodoro Timers",
          steps: [
            "Start a timer from any study room",

            "Timer syncs automatically across all room members",
            "Take breaks when the timer ends",
            "Track your study sessions and productivity",
          ],
        },
        {
          subtitle: "Timer Settings",
          steps: [
            "work and break durations",
            "Set notification preferences",
            "Enable/disable sound alerts",
            "Configure auto-start for breaks",
            "Set daily study goals and limits",
          ],
        },
      ],
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: t("categories.chat.title"),
      description: t("categories.chat.description"),
      content: [
        {
          subtitle: "Real-time Messaging",
          steps: [
            "Chat appears in the right sidebar of study rooms",
            "Type messages and press Enter to send",
            "Use @mentions to notify specific members",

            "Share files and resources in chat",
          ],
        },
        {
          subtitle: "Chat Features",
          steps: [
            "Messages are saved for the session duration",
            "Use markdown formatting for better messages",
            "Share code snippets with syntax highlighting",
          ],
        },
      ],
    },
    {
      id: "notes",
      icon: FileText,
      title: t("categories.notes.title"),
      description: t("categories.notes.description"),
      content: [
        {
          subtitle: "Creating Notes",
          steps: [
            "Click the 'Notes' tab in any study room",
            "Create personal or shared notes",
            "Use the rich text editor for formatting",

            "Organize notes with tags and categories",
          ],
        },
        {
          subtitle: "Collaborating on Notes",
          steps: [
            "Share notes with room members",

            "Export notes as PDF or Markdown",
          ],
        },
      ],
    },
    {
      id: "account",
      icon: Settings,
      title: t("categories.account.title"),
      description: t("categories.account.description"),
      content: [
        {
          subtitle: "Profile Settings",
          steps: [
            "Update your profile picture and information",
            "Set your timezone and preferences",
            "Configure notification settings",
            "Manage privacy and visibility options",
            "Link additional social accounts",
          ],
        },
        {
          subtitle: "Account Security",
          steps: [
            "Change your password regularly",
            "Enable two-factor authentication",
            "Review active sessions and devices",
            "Set up account recovery options",
            "Monitor login activity and alerts",
          ],
        },
      ],
    },
  ];

  const faqs = [
    {
      question: t("faqs.howToJoin.question"),
      answer: t("faqs.howToJoin.answer"),
    },
    {
      question: t("faqs.createRoom.question"),
      answer: t("faqs.createRoom.answer"),
    },
    {
      question: t("faqs.syncTimers.question"),
      answer: t("faqs.syncTimers.answer"),
    },
    {
      question: t("faqs.privateNotes.question"),
      answer: t("faqs.privateNotes.answer"),
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

      {/* Help Sections */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t("categories.title")}</h2>
        <div className="space-y-4">
          {helpSections.map((section) => {
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
                          <ol className="list-decimal list-inside space-y-2">
                            {content.steps.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className="text-muted-foreground"
                              >
                                {step}
                              </li>
                            ))}
                          </ol>
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

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t("faqs.title")}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <Card>
          <CardContent className="p-8">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t("contact.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">{t("contact.contactUs")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:monir.mzs17@gmail.com">
                  {t("contact.sendEmail")}
                </a>
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
