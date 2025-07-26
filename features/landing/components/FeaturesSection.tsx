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

const features = [
  {
    icon: Clock,
    title: "Synchronized Timers",
    description:
      "Pomodoro timers that sync across all room members for focused study sessions with breaks in perfect harmony",
  },
  {
    icon: FileText,
    title: "Collaborative Notes",
    description:
      "Real-time markdown editor for shared note-taking with live collaboration and version history",
  },
  {
    icon: MessageSquare,
    title: "Group Chat",
    description:
      "Instant messaging within study rooms to discuss topics, share resources, and stay connected",
  },
  {
    icon: Users,
    title: "Study Rooms",
    description:
      "Create or join public/private rooms with role-based permissions and member management",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description:
      "Everything updates instantly across all devices and participants with lightning-fast performance",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with enterprise-grade security, encryption, and privacy controls",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to Study Together
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to enhance collaborative learning and
            boost productivity
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
