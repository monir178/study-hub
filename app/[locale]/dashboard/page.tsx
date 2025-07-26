import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RoleBasedDashboard } from "@/features/dashboard/components/RoleBasedDashboard";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "StudyHub dashboard - your personalized learning hub",
};

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <RoleBasedDashboard user={session.user} />
    </Suspense>
  );
}
