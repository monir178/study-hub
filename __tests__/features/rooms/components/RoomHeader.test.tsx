import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="room-header-button" {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogAction: ({ children }: any) => <button>{children}</button>,
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, ...rest }: any) => (
    <div data-testid="room-header-menu-item" {...rest}>
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <div />,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "u1", role: "ADMIN" } }),
}));

jest.mock("@/features/rooms/hooks/useRooms", () => ({
  useLeaveRoom: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useDeleteRoom: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

import { RoomHeader } from "@/features/rooms/components/RoomHeader";

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
  userRole: "ADMIN",
};

describe("RoomHeader", () => {
  it("renders action buttons", () => {
    render(<RoomHeader room={room as any} />);
    expect(screen.getAllByTestId("room-header-button").length).toBeGreaterThan(
      0,
    );
  });
});
