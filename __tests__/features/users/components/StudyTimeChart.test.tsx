import React from "react";
import { render, screen } from "@testing-library/react";
import { StudyTimeChart } from "@/features/users/components/StudyTimeChart";

// Mock recharts primitives that rely on layout/SVG sizing for JSDOM stability
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe("StudyTimeChart", () => {
  const mk = (date: Date, minutes: number) => ({
    startedAt: date.toISOString(),
    _sum: { duration: minutes * 60 },
  });

  it("renders skeleton when loading", () => {
    const { getByTestId } = render(<StudyTimeChart data={[]} loading />);
    expect(getByTestId("study-time-loading")).toBeInTheDocument();
  });

  it("renders with provided data", () => {
    const today = new Date();
    const data = [mk(today, 30)];

    render(<StudyTimeChart data={data} />);
    expect(screen.getByTestId("study-time")).toBeInTheDocument();
  });
});
