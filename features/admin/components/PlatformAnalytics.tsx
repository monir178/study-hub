"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

export function PlatformAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>
            Monitor platform usage, user engagement, and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Daily Active Users
                </p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Study Sessions
                </p>
                <p className="text-2xl font-bold">567</p>
                <p className="text-xs text-green-600">+8% from yesterday</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Messages Sent
                </p>
                <p className="text-2xl font-bold">8,901</p>
                <p className="text-xs text-green-600">+15% from yesterday</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Engagement Rate
                </p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-green-600">+3% from yesterday</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-8 border rounded-lg text-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              Analytics Dashboard Coming Soon
            </h3>
            <p>
              Detailed charts and analytics will be implemented in the next
              phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
