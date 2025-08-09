// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { ProfileFormSkeleton } from "@/features/profile/components/skeletons/ProfileFormSkeleton";

describe("ProfileFormSkeleton", () => {
  it("renders skeleton loading state", () => {
    render(<ProfileFormSkeleton />);

    expect(screen.getByTestId("profile-form-skeleton")).toBeInTheDocument();
  });

  it("renders header skeleton elements", () => {
    render(<ProfileFormSkeleton />);

    expect(screen.getByTestId("skeleton-header")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-title")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-subtitle")).toBeInTheDocument();
  });

  it("renders basic information card skeleton", () => {
    render(<ProfileFormSkeleton />);

    expect(screen.getByTestId("skeleton-basic-info-card")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-basic-info-title")).toBeInTheDocument();
  });

  it("renders profile picture skeleton", () => {
    render(<ProfileFormSkeleton />);

    expect(screen.getByTestId("skeleton-profile-picture")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-upload-button")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-remove-button")).toBeInTheDocument();
  });

  it("renders basic info fields skeleton", () => {
    render(<ProfileFormSkeleton />);

    expect(screen.getByTestId("skeleton-basic-fields")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-field")).toHaveLength(3); // name, email, phone
  });

  it("renders personal information card skeleton", () => {
    render(<ProfileFormSkeleton />);

    expect(
      screen.getByTestId("skeleton-personal-info-card"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-personal-info-title"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-personal-info-fields"),
    ).toBeInTheDocument();
  });

  it("renders address information card skeleton", () => {
    render(<ProfileFormSkeleton />);

    expect(
      screen.getByTestId("skeleton-address-info-card"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-address-info-title"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-address-info-fields"),
    ).toBeInTheDocument();
  });

  it("renders submit buttons skeleton", () => {
    render(<ProfileFormSkeleton />);

    expect(screen.getByTestId("skeleton-submit-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-reset-button")).toBeInTheDocument();
  });

  it("renders correct number of address fields", () => {
    render(<ProfileFormSkeleton />);

    const addressFields = screen.getByTestId("skeleton-address-info-fields");
    // Should have 6 address fields (street, city, region, postal, country, etc.)
    expect(addressFields.children).toHaveLength(6);
  });

  it("has proper layout classes", () => {
    render(<ProfileFormSkeleton />);

    const container = screen.getByTestId("profile-form-skeleton");
    expect(container).toHaveClass("min-h-screen", "bg-background");

    const mainContainer = screen.getByTestId("skeleton-main-container");
    expect(mainContainer).toHaveClass("max-w-7xl", "mx-auto", "space-y-8");
  });

  it("renders responsive grid layout for personal info fields", () => {
    render(<ProfileFormSkeleton />);

    const personalInfoFields = screen.getByTestId(
      "skeleton-personal-info-fields",
    );
    expect(personalInfoFields).toHaveClass(
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-6",
    );
  });

  it("renders responsive grid layout for address info fields", () => {
    render(<ProfileFormSkeleton />);

    const addressInfoFields = screen.getByTestId(
      "skeleton-address-info-fields",
    );
    expect(addressInfoFields).toHaveClass(
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-6",
    );
  });

  it("renders responsive flex layout for submit buttons", () => {
    render(<ProfileFormSkeleton />);

    const submitButtons = screen.getByTestId("skeleton-submit-buttons");
    expect(submitButtons).toHaveClass(
      "flex",
      "flex-col",
      "sm:flex-row",
      "gap-4",
      "pt-8",
      "border-t",
      "justify-end",
    );
  });
});
