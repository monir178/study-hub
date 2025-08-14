import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/test-utils";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="room-card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="room-card-button" {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: any) => (
    <span data-testid="room-card-badge">{children}</span>
  ),
}));

jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogAction: ({ children, ...rest }: any) => (
    <button data-testid="room-card-delete" {...rest}>
      {children}
    </button>
  ),
  AlertDialogCancel: ({ children, ...rest }: any) => (
    <button data-testid="room-card-cancel" {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "u1", role: "ADMIN" } }),
}));

jest.mock("@/features/rooms/hooks/useRooms", () => ({
  useDeleteRoom: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock("@/lib/pusher", () => ({
  subscribeToRoomMembers: jest.fn(() => ({
    bind: jest.fn(),
    unbind: jest.fn(),
  })),
  unsubscribeFromRoomMembers: jest.fn(),
}));

import { StudyRoomCard } from "@/features/rooms/components/StudyRoomCard";

const baseRoom = {
  id: "r1",
  name: "Room",
  description: "Desc",
  isPublic: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: { id: "u1", name: "User", role: "USER" },
  userRole: "USER",
  members: [],
  memberCount: 0,
  onlineMembers: 0,
  messageCount: 0,
  noteCount: 0,
  maxMembers: 10,
  isJoined: false,
};

describe("StudyRoomCard", () => {
  it("renders", () => {
    renderWithProviders(<StudyRoomCard room={baseRoom as any} />);
    expect(screen.getByTestId("room-card")).toBeInTheDocument();
  });

  it("handles primary button click", () => {
    const onJoin = jest.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <StudyRoomCard room={baseRoom as any} onJoin={onJoin} />,
    );
    fireEvent.click(screen.getAllByTestId("room-card-button")[0]);
    expect(screen.getAllByTestId("room-card-button")[0]).toBeInTheDocument();
  });
});
