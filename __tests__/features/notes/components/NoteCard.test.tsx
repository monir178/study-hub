import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NoteCard } from "@/features/notes/components/NoteCard";

describe("NoteCard", () => {
  const makeNote = (id: string, title: string) => ({
    id,
    title,
    content: "content",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    roomId: "room-1",
    createdBy: "user-1",
    creator: { id: "user-1", name: "User", email: "u@e.com", role: "USER" },
  });

  const permissions = {
    canEdit: true,
    canDelete: true,
    canExport: true,
    canRead: true,
  };

  it("calls onSelect when clicked", () => {
    const onSelect = jest.fn();
    render(
      <NoteCard
        note={makeNote("1", "Title")}
        onSelect={onSelect}
        permissions={permissions}
        isDeleting={false}
        onDeleteClick={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId("note-card"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("calls onDeleteClick when delete clicked", () => {
    const onDeleteClick = jest.fn();
    render(
      <NoteCard
        note={makeNote("1", "Title")}
        onSelect={jest.fn()}
        permissions={permissions}
        isDeleting={false}
        onDeleteClick={onDeleteClick}
      />,
    );
    const card = screen.getByTestId("note-card");
    // Find the button inside and click it
    const deleteButton = card.querySelector("button");
    expect(deleteButton).toBeTruthy();
    fireEvent.click(deleteButton!);
    expect(onDeleteClick).toHaveBeenCalled();
  });
});
