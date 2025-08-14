import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  BookOpen,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";

export default function CommunityPage() {
  const t = useTranslations("community");

  const communityStats = [
    {
      icon: Users,
      value: "10,000+",
      label: t("stats.activeUsers"),
    },
    {
      icon: MessageSquare,
      value: "50,000+",
      label: t("stats.messages"),
    },
    {
      icon: BookOpen,
      value: "25,000+",
      label: t("stats.studySessions"),
    },
    {
      icon: Heart,
      value: "98%",
      label: t("stats.satisfaction"),
    },
  ];

  const communityFeatures = [
    {
      icon: Users,
      title: t("features.studyGroups.title"),
      description: t("features.studyGroups.description"),
    },
    {
      icon: MessageSquare,
      title: t("features.discussions.title"),
      description: t("features.discussions.description"),
    },
    {
      icon: BookOpen,
      title: t("features.resources.title"),
      description: t("features.resources.description"),
    },
    {
      icon: Star,
      title: t("features.achievements.title"),
      description: t("features.achievements.description"),
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

      {/* Community Stats */}
      <div className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Community Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t("features.title")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {communityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Join Community */}
      <div className="text-center">
        <Card>
          <CardContent className="p-8">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">{t("join.title")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("join.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/signup">{t("join.getStarted")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/rooms">{t("join.exploreRooms")}</Link>
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
