import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// CardContent appears multiple times in the component; assign testids to a wrapper unique to page root
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => (
    <div data-testid="rooms-list-root">{children}</div>
  ),
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="rooms-list-button" {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input data-testid="rooms-list-input" {...props} />,
}));

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <button>{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/features/rooms/components/StudyRoomCard", () => ({
  StudyRoomCard: () => <div data-testid="study-room-card" />,
}));

jest.mock("@/features/rooms/hooks/useRooms", () => ({
  useRooms: () => ({
    data: { rooms: [], pagination: { pages: 1, total: 0 } },
    isLoading: false,
    error: undefined,
    refetch: jest.fn(),
    isRefetching: false,
  }),
  useJoinRoom: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useLeaveRoom: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

import { StudyRoomList } from "@/features/rooms/components/StudyRoomList";

describe("StudyRoomList", () => {
  it("renders root", () => {
    render(<StudyRoomList />);
    expect(screen.getAllByTestId("rooms-list-root").length).toBeGreaterThan(0);
  });
});
