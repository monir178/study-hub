import React from "react";
import { render, screen } from "@testing-library/react";
import { SessionTypesChart } from "@/features/users/components/SessionTypesChart";

// Stabilize recharts in JSDOM
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe("SessionTypesChart", () => {
  const data = [
    { type: "POMODORO" as const, _count: { type: 5 } },
    { type: "CUSTOM" as const, _count: { type: 2 } },
    { type: "BREAK" as const, _count: { type: 3 } },
  ];

  it("renders skeleton when loading", () => {
    const { getByTestId } = render(<SessionTypesChart data={data} loading />);
    expect(getByTestId("session-types-loading")).toBeInTheDocument();
  });

  it("renders with provided distribution", () => {
    render(<SessionTypesChart data={data} />);
    expect(screen.getByTestId("session-types")).toBeInTheDocument();
  });
});
