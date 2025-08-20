import React from "react";
import { render, screen } from "@testing-library/react";
import { UserDashboardStats } from "@/features/users/components/UserDashboardStats";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock recharts components
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe("UserDashboardStats", () => {
  const stats = {
    totalStudyTime: 3600,
    totalSessions: 12,
    createdRooms: 3,
    privateRooms: 1,
    joinedRoomsCount: 5,
    averageSessionTime: 300,
  };

  const trends = {
    studyTime: { change: "+10%", trend: "up" as const, changeCount: 10 },
    sessions: { change: "+2", trend: "up" as const, changeCount: 2 },
    rooms: { change: "-1", trend: "down" as const, changeCount: -1 },
    createdRooms: { change: "+1", trend: "up" as const, changeCount: 1 },
    privateRooms: { change: "0", trend: "neutral" as const, changeCount: 0 },
  };

  it("renders skeleton when loading is true", () => {
    const { getByTestId } = render(
      <UserDashboardStats stats={stats} trends={trends} loading={true} />,
    );
    expect(getByTestId("user-stats-loading")).toBeInTheDocument();
  });

  it("renders stats cards", () => {
    render(<UserDashboardStats stats={stats} trends={trends} />);
    expect(screen.getByTestId("user-stats")).toBeInTheDocument();
    expect(screen.getAllByTestId("user-stats-card").length).toBeGreaterThan(0);
  });
});
