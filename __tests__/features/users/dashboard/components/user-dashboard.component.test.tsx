import React from "react";
import { render, screen } from "@testing-library/react";
import { UserDashboard } from "@/features/users/dashboard/components/user-dashboard.component";

// Mock hooks and child components to control state and avoid heavy renders
jest.mock("@/features/users/hooks/useUserDashboard", () => ({
  useUserDashboard: jest.fn(),
}));

jest.mock("@/features/users/components/UserDashboardStats", () => ({
  UserDashboardStats: () => <div data-testid="user-stats" />,
}));

jest.mock("@/features/users/components/UserDashboardBento", () => ({
  UserDashboardBento: () => <div data-testid="user-bento" />,
}));

jest.mock("@/features/users/components/StudyTimeChart", () => ({
  StudyTimeChart: () => <div data-testid="study-time" />,
}));

jest.mock("@/features/users/components/RecentRooms", () => ({
  RecentRooms: () => <div data-testid="recent-rooms" />,
}));

jest.mock("@/features/users/components/RecentNotes", () => ({
  RecentNotes: () => <div data-testid="recent-notes" />,
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("UserDashboard (component)", () => {
  const { useUserDashboard } = jest.requireMock(
    "@/features/users/hooks/useUserDashboard",
  ) as { useUserDashboard: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders skeleton when data is not yet available", () => {
    useUserDashboard.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    render(<UserDashboard />);

    expect(screen.getByTestId("user-dashboard-skeleton")).toBeInTheDocument();
  });

  it("renders error state when error is present", () => {
    useUserDashboard.mockReturnValue({
      data: undefined,
      error: new Error("x"),
      isLoading: false,
    });

    render(<UserDashboard />);

    expect(screen.getByTestId("user-dashboard-error")).toBeInTheDocument();
  });

  it("renders dashboard content when data is available", () => {
    const data = {
      stats: {},
      trends: {},
      studyTimeByDay: [],
      recentRooms: [],
      recentNotes: [],
      recentSessions: [],
      streak: { current: 0, max: 0, days: 0 },
    };

    useUserDashboard.mockReturnValue({ data, error: null, isLoading: false });

    render(<UserDashboard />);

    expect(screen.getByTestId("user-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("user-stats")).toBeInTheDocument();
    expect(screen.getByTestId("study-time")).toBeInTheDocument();
    expect(screen.getByTestId("recent-rooms")).toBeInTheDocument();
    expect(screen.getByTestId("recent-notes")).toBeInTheDocument();
    expect(screen.getByTestId("user-bento")).toBeInTheDocument();
  });
});
