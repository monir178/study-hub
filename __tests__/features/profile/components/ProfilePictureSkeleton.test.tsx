// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProfilePictureSkeleton } from "@/features/profile/components/skeletons/ProfilePictureSkeleton";

describe("ProfilePictureSkeleton", () => {
  it("renders profile picture skeleton loading state", () => {
    render(<ProfilePictureSkeleton />);

    expect(screen.getByTestId("profile-picture-skeleton")).toBeInTheDocument();
  });

  it("renders avatar skeleton", () => {
    render(<ProfilePictureSkeleton />);

    expect(screen.getByTestId("skeleton-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-avatar")).toHaveClass(
      "w-32",
      "h-32",
      "rounded-full",
    );
  });

  it("renders avatar badge skeleton", () => {
    render(<ProfilePictureSkeleton />);

    expect(screen.getByTestId("skeleton-avatar-badge")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-avatar-badge")).toHaveClass(
      "absolute",
      "bottom-0",
      "right-0",
      "w-8",
      "h-8",
      "rounded-full",
    );
  });

  it("renders action buttons skeleton", () => {
    render(<ProfilePictureSkeleton />);

    expect(screen.getByTestId("skeleton-action-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-upload-button")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-remove-button")).toBeInTheDocument();
  });

  it("renders status text skeleton", () => {
    render(<ProfilePictureSkeleton />);

    expect(screen.getByTestId("skeleton-status-text")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-status-text")).toHaveClass(
      "h-3",
      "w-40",
    );
  });

  it("has proper layout structure", () => {
    render(<ProfilePictureSkeleton />);

    const container = screen.getByTestId("profile-picture-skeleton");
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "space-y-4",
    );
  });

  it("renders buttons with correct sizes", () => {
    render(<ProfilePictureSkeleton />);

    const uploadButton = screen.getByTestId("skeleton-upload-button");
    const removeButton = screen.getByTestId("skeleton-remove-button");

    expect(uploadButton).toHaveClass("h-9", "w-24");
    expect(removeButton).toHaveClass("h-9", "w-20");
  });

  it("renders buttons container with gap", () => {
    render(<ProfilePictureSkeleton />);

    const buttonsContainer = screen.getByTestId("skeleton-action-buttons");
    expect(buttonsContainer).toHaveClass("flex", "gap-2");
  });

  it("positions avatar badge correctly", () => {
    render(<ProfilePictureSkeleton />);

    const avatarContainer = screen.getByTestId("skeleton-avatar-container");
    expect(avatarContainer).toHaveClass("relative");

    const avatarBadge = screen.getByTestId("skeleton-avatar-badge");
    expect(avatarBadge).toHaveClass("absolute", "bottom-0", "right-0");
  });
});
