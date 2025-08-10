"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Users,
  MessageSquare,
  FileText,
  Zap,
  Shield,
} from "lucide-react";

export default function FeaturesSection() {
  const t = useTranslations("landing.features");

  const features = [
    {
      icon: Clock,
      title: t("synchronizedTimers.title"),
      description: t("synchronizedTimers.description"),
      iconColor: "text-primary",
      size: "large",
    },
    {
      icon: FileText,
      title: t("personalNotes.title"),
      description: t("personalNotes.description"),
      iconColor: "text-primary",
      size: "small",
    },
    {
      icon: MessageSquare,
      title: t("groupChat.title"),
      description: t("groupChat.description"),
      iconColor: "text-primary",
      size: "small",
    },
    {
      icon: Users,
      title: t("studyRooms.title"),
      description: t("studyRooms.description"),
      iconColor: "text-primary",
      size: "small",
    },
    {
      icon: Zap,
      title: t("realTimeSync.title"),
      description: t("realTimeSync.description"),
      iconColor: "text-primary",
      size: "small",
    },
    {
      icon: Shield,
      title: t("securePrivate.title"),
      description: t("securePrivate.description"),
      iconColor: "text-primary",
      size: "large",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-6xl font-black max-w-[20ch] mx-auto pb-2 leading-[1.05] tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground/40 from-1% via-foreground/95 to-foreground/80">
              {t("title.part1")}
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
              {t("title.part2")}
            </span>
          </h2>
          <p className="lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-6">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          {/* First Row */}
          <div className="grid md:grid-cols-5 gap-6 items-stretch">
            {/* Left Column - Large Card */}
            <div className="md:col-span-2">
              <FeatureCard feature={features[0]} isLarge />
            </div>

            {/* Right Column - Two Small Cards */}
            <div className="md:col-span-3 flex flex-col gap-6">
              <FeatureCard feature={features[1]} />
              <FeatureCard feature={features[2]} />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid md:grid-cols-5 gap-6 items-stretch">
            {/* Left Column - Two Small Cards */}
            <div className="md:col-span-3 flex flex-col gap-6">
              <FeatureCard feature={features[3]} />
              <FeatureCard feature={features[4]} />
            </div>

            {/* Right Column - Large Card */}
            <div className="md:col-span-2">
              <FeatureCard feature={features[5]} isLarge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  isLarge = false,
}: {
  feature: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
    iconColor: string;
  };
  isLarge?: boolean;
}) {
  const gradients = [
    "from-primary/10 via-primary/15 to-transparent",
    "from-primary/10 via-primary/10 to-transparent",
    "from-primary/10 via-primary/20 to-transparent",
    "from-primary/10 via-primary/8 to-transparent",
    "from-primary/10 via-primary/18 to-transparent",
    "from-primary/10 via-primary/12 to-transparent",
  ];

  const gradientIndex = feature.title.length % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl group cursor-pointer bg-card/50 backdrop-blur-sm transition-all duration-300 ${isLarge ? "h-full" : ""}`}
    >
      {/* Blurry gradient background in corner */}
      <div
        className={`absolute -top-8 -right-8 w-1/2 h-1/2 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-80`}
      />

      {/* Hover overlay - only background change */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader
        className={`relative z-10 ${isLarge ? "p-10 h-full flex flex-col justify-center" : "p-8"}`}
      >
        <div className={`mb-6 ${isLarge ? "mb-8" : ""}`}>
          <feature.icon
            className={`
            ${isLarge ? "w-16 h-16" : "w-12 h-12"} 
            ${feature.iconColor} drop-shadow-sm
          `}
          />
        </div>

        <CardTitle
          className={`
          ${isLarge ? "text-2xl lg:text-4xl mb-6 font-bold" : "text-xl lg:text-2xl mb-4 font-bold"} 
          text-foreground leading-tight
        `}
        >
          {feature.title}
        </CardTitle>

        <CardDescription
          className={`
          ${isLarge ? "text-lg leading-relaxed font-medium" : "text-base leading-relaxed"} 
          text-muted-foreground/90
        `}
        >
          {feature.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
