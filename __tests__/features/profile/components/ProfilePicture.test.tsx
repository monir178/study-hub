// @ts-nocheck
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfilePicture } from "@/features/profile/components/ProfilePicture";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

// Mock sonner
jest.mock("sonner");

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg",
};

describe("ProfilePicture", () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders profile picture component", () => {
    render(
      <ProfilePicture
        user={mockUser}
        selectedFile={null}
        onFileSelect={mockOnFileSelect}
      />,
    );

    expect(screen.getByTestId("profile-picture")).toBeInTheDocument();
    expect(screen.getByTestId("profile-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("shows remove button when user has image", () => {
    render(
      <ProfilePicture
        user={mockUser}
        selectedFile={null}
        onFileSelect={mockOnFileSelect}
      />,
    );

    expect(screen.getByTestId("remove-button")).toBeInTheDocument();
  });

  it("handles upload button click", () => {
    render(
      <ProfilePicture
        user={mockUser}
        selectedFile={null}
        onFileSelect={mockOnFileSelect}
      />,
    );

    const uploadButton = screen.getByTestId("upload-button");
    fireEvent.click(uploadButton);
    // Button should be clickable (no errors thrown)
    expect(uploadButton).toBeInTheDocument();
  });

  it("handles remove button click", () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    render(
      <ProfilePicture
        user={mockUser}
        selectedFile={mockFile}
        onFileSelect={mockOnFileSelect}
      />,
    );

    const removeButton = screen.getByTestId("remove-button");
    fireEvent.click(removeButton);
    expect(mockOnFileSelect).toHaveBeenCalledWith(null);
  });
});
