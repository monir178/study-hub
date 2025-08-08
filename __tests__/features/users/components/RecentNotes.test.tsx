// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { RecentNotes } from "@/features/users/components/RecentNotes";

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

describe("RecentNotes", () => {
  const makeNote = (id: string, title: string, updatedAt: string) => ({
    id,
    title,
    content: "",
    createdAt: updatedAt,
    updatedAt,
    version: 1,
    roomId: "room-1",
    createdBy: "user-1",
    room: { name: "Room A" },
  });

  it("renders skeleton when loading is true", () => {
    const { getByTestId } = render(
      <RecentNotes recentNotes={[]} loading={true} />,
    );
    expect(getByTestId("recent-notes-loading")).toBeInTheDocument();
  });

  it("renders empty state when no notes", () => {
    render(<RecentNotes recentNotes={[]} />);
    expect(screen.getByTestId("recent-notes-empty")).toBeInTheDocument();
  });

  it("renders top 3 recent notes and actions when notes are provided", () => {
    const notes = [
      makeNote("1", "Note 1", new Date().toISOString()),
      makeNote("2", "Note 2", new Date().toISOString()),
      makeNote("3", "Note 3", new Date().toISOString()),
      makeNote("4", "Note 4", new Date().toISOString()),
    ];

    render(<RecentNotes recentNotes={notes} />);

    // Container
    expect(screen.getByTestId("recent-notes")).toBeInTheDocument();

    // Renders at most 3 notes
    expect(screen.getAllByTestId("recent-note-item")).toHaveLength(3);

    // Footer action
    expect(screen.getByTestId("recent-notes-view-all")).toBeInTheDocument();
  });
});
