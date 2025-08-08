import React from "react";
import { render, screen } from "@testing-library/react";
import { UserDashboardBento } from "@/features/users/components/UserDashboardBento";

// Mock Link that forwards props
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

describe("UserDashboardBento", () => {
  const mkSession = (id: string) => ({
    id,
    duration: 1500,
    type: "POMODORO" as const,
    status: "COMPLETED" as const,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    phase: "focus",
    remaining: 0,
    session: 1,
    totalSessions: 4,
    controlledBy: null,
    userId: "u1",
    roomId: "r1",
  });

  const mkRoom = (id: string, name: string) => ({
    id,
    role: "MEMBER" as const,
    status: "ONLINE" as const,
    joinedAt: new Date().toISOString(),
    userId: "u1",
    roomId: `room-${id}`,
    room: {
      id: `room-${id}`,
      name,
      description: null,
      isPublic: true,
      maxMembers: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: "c1",
      members: [],
    },
  });

  const mkNote = (id: string, title: string) => ({
    id,
    title,
    content: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    roomId: "r1",
    createdBy: "u1",
    room: { name: "Room A" },
  });

  const streak = { current: 3, max: 5, days: 3 };

  it("renders skeleton when loading", () => {
    const { getByTestId } = render(
      <UserDashboardBento
        recentSessions={[]}
        recentRooms={[]}
        recentNotes={[]}
        streak={streak}
        loading
      />,
    );
    expect(getByTestId("user-bento-loading")).toBeInTheDocument();
  });

  it("renders quick actions and streak", () => {
    render(
      <UserDashboardBento
        recentSessions={[mkSession("1")]}
        recentRooms={[mkRoom("1", "Room 1")]}
        recentNotes={[mkNote("1", "Note 1")]}
        streak={streak}
      />,
    );

    // Quick actions via test ids
    expect(screen.getByTestId("quick-create-room")).toBeInTheDocument();
    expect(screen.getByTestId("quick-browse-rooms")).toBeInTheDocument();
    expect(screen.getByTestId("quick-notes")).toBeInTheDocument();

    // Streak section
    expect(screen.getByTestId("streak-current")).toHaveTextContent(
      String(streak.current),
    );
  });
});
