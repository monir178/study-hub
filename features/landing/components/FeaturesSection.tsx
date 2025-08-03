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
    },
    {
      icon: FileText,
      title: t("collaborativeNotes.title"),
      description: t("collaborativeNotes.description"),
    },
    {
      icon: MessageSquare,
      title: t("groupChat.title"),
      description: t("groupChat.description"),
    },
    {
      icon: Users,
      title: t("studyRooms.title"),
      description: t("studyRooms.description"),
    },
    {
      icon: Zap,
      title: t("realTimeSync.title"),
      description: t("realTimeSync.description"),
    },
    {
      icon: Shield,
      title: t("securePrivate.title"),
      description: t("securePrivate.description"),
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
