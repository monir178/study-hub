import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotesHeader } from "@/features/notes/components/NotesHeader";

describe("NotesHeader", () => {
  const permissions = {
    canEdit: true,
    canDelete: true,
    canExport: true,
    canRead: true,
  };

  it("renders and triggers create note", () => {
    const onCreate = jest.fn();
    render(
      <NotesHeader
        notesCount={2}
        showBackButton={false}
        onCreateNote={onCreate}
        permissions={permissions}
      />,
    );
    expect(screen.getByTestId("notes-header")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("notes-new-btn"));
    expect(onCreate).toHaveBeenCalled();
  });
});
