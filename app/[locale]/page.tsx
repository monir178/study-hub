import { Button } from "@/components/ui/button";
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
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold">StudyHub</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Collaborative Learning
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join study rooms, sync Pomodoro timers, collaborate on notes, and
            chat in real-time. The ultimate platform for focused group learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/rooms">Explore Study Rooms</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Study Together
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Synchronized Timers</CardTitle>
                <CardDescription>
                  Pomodoro timers that sync across all room members for focused
                  study sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Collaborative Notes</CardTitle>
                <CardDescription>
                  Real-time markdown editor for shared note-taking with live
                  collaboration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Group Chat</CardTitle>
                <CardDescription>
                  Instant messaging within study rooms to discuss topics and
                  stay connected
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Study Rooms</CardTitle>
                <CardDescription>
                  Create or join public/private rooms with role-based
                  permissions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Real-time Sync</CardTitle>
                <CardDescription>
                  Everything updates instantly across all devices and
                  participants
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your data is protected with enterprise-grade security and
                  privacy
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Study Sessions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students already using StudyHub to achieve their
            learning goals together.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Learning Together</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 StudyHub. Built with Next.js, Tailwind CSS, and ❤️</p>
        </div>
      </footer>
    </div>
  );
}
