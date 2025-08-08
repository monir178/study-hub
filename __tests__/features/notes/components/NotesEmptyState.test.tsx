import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotesEmptyState } from "@/features/notes/components/NotesEmptyState";

describe("NotesEmptyState", () => {
  const perms = {
    canEdit: true,
    canDelete: true,
    canExport: true,
    canRead: true,
  };

  it("renders and allows create when editable and no search", () => {
    const onCreate = jest.fn();
    render(
      <NotesEmptyState
        searchQuery=""
        permissions={perms}
        onCreateNote={onCreate}
        room={{
          id: "r1",
          name: "R",
          isPublic: true,
          creatorId: "u1",
          members: [],
        }}
      />,
    );
    expect(screen.getByTestId("notes-empty-state-root")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("notes-empty-create"));
    expect(onCreate).toHaveBeenCalled();
  });
});
