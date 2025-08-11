import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "u1", role: "USER" } }),
}));

jest.mock("@/features/rooms/hooks/useRooms", () => ({
  useRoom: () => ({
    data: {
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
    },
    isLoading: false,
    error: undefined,
  }),
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

jest.mock("@/features/timer/components/PomodoroTimer", () => ({
  PomodoroTimer: () => <div data-testid="pomodoro" />,
}));

jest.mock("@/features/notes/components/NotesContainer", () => ({
  NotesContainer: () => <div data-testid="notes-container" />,
}));

jest.mock("@/features/rooms/components/RoomHeader", () => ({
  RoomHeader: () => <div data-testid="room-header" />,
}));

jest.mock("@/features/rooms/components/GroupChat", () => ({
  GroupChat: () => <div data-testid="group-chat" />,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

import { RoomLayout } from "@/features/rooms/components/RoomLayout";

describe("RoomLayout", () => {
  it("renders header and children blocks", () => {
    render(<RoomLayout roomId="r1" />);
    expect(screen.getByTestId("room-header")).toBeInTheDocument();
    expect(screen.getByTestId("group-chat")).toBeInTheDocument();
    expect(screen.getByTestId("notes-container")).toBeInTheDocument();
  });
});
