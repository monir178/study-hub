"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Users,
  Lightbulb,
  Heart,
  BookOpen,
  Globe,
  Zap,
  Trophy,
} from "lucide-react";

export default function AboutSection() {
  const t = useTranslations("landing.about");

  const values = [
    {
      icon: Target,
      title: t("values.collaboration.title"),
      description: t("values.collaboration.description"),
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Lightbulb,
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: Users,
      title: t("values.community.title"),
      description: t("values.community.description"),
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Heart,
      title: t("values.accessibility.title"),
      description: t("values.accessibility.description"),
      color: "text-red-600 dark:text-red-400",
    },
  ];

  const stats = [
    {
      icon: Users,
      number: "50k+",
      label: t("stats.users"),
    },
    {
      icon: BookOpen,
      number: "100k+",
      label: t("stats.sessions"),
    },
    {
      icon: Globe,
      number: "25+",
      label: t("stats.countries"),
    },
    {
      icon: Trophy,
      number: "95%",
      label: t("stats.satisfaction"),
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            {t("badge")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {t("mission.title")}
                </h3>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  {t("mission.description")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            {t("values.title")}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Icon className={`w-12 h-12 mx-auto ${value.color}`} />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-background rounded-2xl border shadow-sm p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            {t("stats.title")}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            {t("story.title")}
          </h3>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t("story.paragraph1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("story.paragraph2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
