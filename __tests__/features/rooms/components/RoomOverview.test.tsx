import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => (
    <div data-testid="room-overview-root">{children}</div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}));

import { RoomOverview } from "@/features/rooms/components/RoomOverview";

const room = {
  id: "r1",
  name: "Room",
  description: "",
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: { id: "u1", name: "User", role: "USER" },
  members: [],
  memberCount: 2,
  onlineMembers: 1,
  messageCount: 3,
  noteCount: 4,
  maxMembers: 10,
  isJoined: true,
  userRole: "USER",
};

describe("RoomOverview", () => {
  it("renders", () => {
    render(<RoomOverview room={room as any} />);
    expect(screen.getByTestId("room-overview-root")).toBeInTheDocument();
  });
});
