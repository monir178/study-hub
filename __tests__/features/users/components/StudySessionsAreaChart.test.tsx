import React from "react";
import { render, screen } from "@testing-library/react";
import { StudySessionsAreaChart } from "@/features/users/components/StudySessionsAreaChart";

// Stabilize recharts in JSDOM
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe("StudySessionsAreaChart", () => {
  const mk = (idx: number) => ({
    id: `${idx}`,
    duration: 25 * 60,
    type: "POMODORO" as const,
    status: "COMPLETED" as const,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    phase: "focus",
    remaining: 0,
    session: idx,
    totalSessions: 4,
    controlledBy: null,
    userId: "u1",
    roomId: "r1",
  });

  it("renders skeleton when loading", () => {
    const { getByTestId } = render(
      <StudySessionsAreaChart data={[]} loading />,
    );
    expect(getByTestId("sessions-area-loading")).toBeInTheDocument();
  });

  it("renders with provided sessions", () => {
    const data = [mk(1), mk(2), mk(3)];
    render(<StudySessionsAreaChart data={data} />);
    expect(screen.getByTestId("sessions-area")).toBeInTheDocument();
  });
});
