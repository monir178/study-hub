import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserNoteCard } from "@/features/notes/components/UserNoteCard";

describe("UserNoteCard", () => {
  const makeUserNote = (id: string, title: string) => ({
    id,
    title,
    content: "content",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    roomId: "room-1",
    createdBy: "user-1",
    creator: {
      id: "user-1",
      name: "User",
      email: "u@e.com",
      role: "USER",
      image: null,
    },
    room: { id: "room-1", name: "Room", isPublic: true, members: [] },
  });

  it("renders and invokes onSelect", () => {
    const onSelect = jest.fn();
    render(
      <UserNoteCard
        note={makeUserNote("1", "Title")}
        isSelected={false}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByTestId("user-note-card"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("applies selected styles when isSelected", () => {
    render(
      <UserNoteCard
        note={makeUserNote("1", "Title")}
        isSelected={true}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByTestId("user-note-card")).toBeInTheDocument();
  });
});
