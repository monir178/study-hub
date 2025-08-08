import React from "react";
import { render, screen } from "@testing-library/react";
import { UserDashboardStats } from "@/features/users/components/UserDashboardStats";

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
