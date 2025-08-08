// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { RecentRooms } from "@/features/users/components/RecentRooms";

// Mock next-intl navigation Link to a simple anchor
jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("RecentRooms", () => {
  const makeMember = (id: string, name: string, membersCount: number) => ({
    id,
    role: "MEMBER" as const,
    status: "ONLINE" as const,
    joinedAt: new Date().toISOString(),
    userId: "user-1",
    roomId: `room-${id}`,
    room: {
      id: `room-${id}`,
      name,
      description: null,
      isPublic: true,
      maxMembers: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: "creator-1",
      members: Array.from({ length: membersCount }, (_, i) => ({
        id: `m-${i}`,
        role: "MEMBER" as const,
        status: "ONLINE" as const,
        joinedAt: new Date().toISOString(),
        userId: `u-${i}`,
        roomId: `room-${id}`,
        user: { name: `U${i}`, image: null },
      })),
    },
  });

  it("renders skeleton when loading is true", () => {
    const { getByTestId } = render(
      <RecentRooms recentRooms={[]} loading={true} />,
    );
    expect(getByTestId("recent-rooms-loading")).toBeInTheDocument();
  });

  it("renders empty state when no rooms", () => {
    render(<RecentRooms recentRooms={[]} />);
    expect(screen.getByTestId("recent-rooms-empty")).toBeInTheDocument();
  });

  it("renders top 3 recent rooms and actions when rooms are provided", () => {
    const rooms = [
      makeMember("1", "Room 1", 3),
      makeMember("2", "Room 2", 5),
      makeMember("3", "Room 3", 2),
      makeMember("4", "Room 4", 1),
    ];

    render(<RecentRooms recentRooms={rooms} />);

    // Container
    expect(screen.getByTestId("recent-rooms")).toBeInTheDocument();

    // Renders at most 3 rooms
    expect(screen.getAllByTestId("recent-room-item")).toHaveLength(3);

    // Footer action
    expect(screen.getByTestId("recent-rooms-view-all")).toBeInTheDocument();
  });
});
