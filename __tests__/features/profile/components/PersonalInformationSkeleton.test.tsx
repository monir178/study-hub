// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { PersonalInformationSkeleton } from "@/features/profile/components/skeletons/PersonalInformationSkeleton";

describe("PersonalInformationSkeleton", () => {
  it("renders personal information skeleton loading state", () => {
    render(<PersonalInformationSkeleton />);

    expect(
      screen.getByTestId("personal-information-skeleton"),
    ).toBeInTheDocument();
  });

  it("renders gender field skeleton", () => {
    render(<PersonalInformationSkeleton />);

    expect(screen.getByTestId("skeleton-gender-field")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-gender-label")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-gender-input")).toBeInTheDocument();
  });

  it("renders date of birth field skeleton", () => {
    render(<PersonalInformationSkeleton />);

    expect(
      screen.getByTestId("skeleton-date-of-birth-field"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-date-of-birth-label"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-date-of-birth-input"),
    ).toBeInTheDocument();
  });

  it("has proper grid layout", () => {
    render(<PersonalInformationSkeleton />);

    const container = screen.getByTestId("personal-information-skeleton");
    expect(container).toHaveClass(
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-6",
    );
  });

  it("renders skeleton elements with correct sizes", () => {
    render(<PersonalInformationSkeleton />);

    const genderLabel = screen.getByTestId("skeleton-gender-label");
    const genderInput = screen.getByTestId("skeleton-gender-input");
    const dateLabel = screen.getByTestId("skeleton-date-of-birth-label");
    const dateInput = screen.getByTestId("skeleton-date-of-birth-input");

    expect(genderLabel).toHaveClass("h-4", "w-16", "mb-2");
    expect(genderInput).toHaveClass("h-10", "w-full");
    expect(dateLabel).toHaveClass("h-4", "w-24", "mb-2");
    expect(dateInput).toHaveClass("h-10", "w-full");
  });

  it("renders exactly two field skeletons", () => {
    render(<PersonalInformationSkeleton />);

    const container = screen.getByTestId("personal-information-skeleton");
    expect(container.children).toHaveLength(2);
  });

  it("renders fields in correct order", () => {
    render(<PersonalInformationSkeleton />);

    const container = screen.getByTestId("personal-information-skeleton");
    const firstChild = container.children[0];
    const secondChild = container.children[1];

    expect(firstChild).toHaveAttribute("data-testid", "skeleton-gender-field");
    expect(secondChild).toHaveAttribute(
      "data-testid",
      "skeleton-date-of-birth-field",
    );
  });
});
