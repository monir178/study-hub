import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, FileText, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold">StudyHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your study sessions and collaborate with others
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Plus className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">Create Room</CardTitle>
              <CardDescription>Start a new study session</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">Join Room</CardTitle>
              <CardDescription>Find active study rooms</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">My Sessions</CardTitle>
              <CardDescription>View study history</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">My Notes</CardTitle>
              <CardDescription>Access saved notes</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Rooms</CardTitle>
              <CardDescription>Your recently joined rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mathematics Study Group</p>
                    <p className="text-sm text-muted-foreground">
                      3 members active
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Physics Homework Session</p>
                    <p className="text-sm text-muted-foreground">
                      1 member active
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Join
                  </Button>
                </div>
                <div className="text-center py-4">
                  <Button variant="ghost" asChild>
                    <Link href="/rooms">View All Rooms</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Statistics</CardTitle>
              <CardDescription>Your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Study Time</span>
                  <span className="text-2xl font-bold">12h 30m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Sessions This Week
                  </span>
                  <span className="text-2xl font-bold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Notes Created</span>
                  <span className="text-2xl font-bold">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rooms Joined</span>
                  <span className="text-2xl font-bold">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
