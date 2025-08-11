import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "u1", role: "USER" } }),
}));

jest.mock("@/features/rooms/hooks/useRoomMembers", () => ({
  useRoomMembers: () => ({
    members: [],
    memberCount: 0,
    onlineMembers: 0,
    loading: {},
    error: undefined,
    actions: { joinRoom: jest.fn(), leaveRoom: jest.fn() },
  }),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => (
    <div data-testid="room-sidebar-root">{children}</div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

import { RoomSidebar } from "@/features/rooms/components/RoomSidebar";

const room = {
  id: "r1",
  name: "Room",
  description: "",
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: { id: "u1", name: "User", role: "USER" },
  members: [],
  memberCount: 0,
  onlineMembers: 0,
  messageCount: 0,
  noteCount: 0,
  maxMembers: 10,
  isJoined: true,
  userRole: "USER",
};

describe("RoomSidebar", () => {
  it("renders root", () => {
    render(<RoomSidebar room={room as any} />);
    expect(screen.getByTestId("room-sidebar-root")).toBeInTheDocument();
  });
});
