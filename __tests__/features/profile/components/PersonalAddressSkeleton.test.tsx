// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { PersonalAddressSkeleton } from "@/features/profile/components/skeletons/PersonalAddressSkeleton";

describe("PersonalAddressSkeleton", () => {
  it("renders personal address skeleton loading state", () => {
    render(<PersonalAddressSkeleton />);

    expect(screen.getByTestId("personal-address-skeleton")).toBeInTheDocument();
  });

  it("renders street field skeleton", () => {
    render(<PersonalAddressSkeleton />);

    expect(screen.getByTestId("skeleton-street-field")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-street-label")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-street-input")).toBeInTheDocument();
  });

  it("renders city field skeleton", () => {
    render(<PersonalAddressSkeleton />);

    expect(screen.getByTestId("skeleton-city-field")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-city-label")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-city-input")).toBeInTheDocument();
  });

  it("renders region field skeleton", () => {
    render(<PersonalAddressSkeleton />);

    expect(screen.getByTestId("skeleton-region-field")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-region-label")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-region-input")).toBeInTheDocument();
  });

  it("renders postal code field skeleton", () => {
    render(<PersonalAddressSkeleton />);

    expect(
      screen.getByTestId("skeleton-postal-code-field"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-postal-code-label"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-postal-code-input"),
    ).toBeInTheDocument();
  });

  it("renders country field skeleton", () => {
    render(<PersonalAddressSkeleton />);

    expect(screen.getByTestId("skeleton-country-field")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-country-label")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-country-input")).toBeInTheDocument();
  });

  it("has proper grid layout", () => {
    render(<PersonalAddressSkeleton />);

    const container = screen.getByTestId("personal-address-skeleton");
    expect(container).toHaveClass(
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-6",
    );
  });

  it("street field spans full width", () => {
    render(<PersonalAddressSkeleton />);

    const streetField = screen.getByTestId("skeleton-street-field");
    expect(streetField).toHaveClass("lg:col-span-2");
  });

  it("renders skeleton elements with correct sizes", () => {
    render(<PersonalAddressSkeleton />);

    // Check labels
    expect(screen.getByTestId("skeleton-street-label")).toHaveClass(
      "h-4",
      "w-24",
      "mb-2",
    );
    expect(screen.getByTestId("skeleton-city-label")).toHaveClass(
      "h-4",
      "w-12",
      "mb-2",
    );
    expect(screen.getByTestId("skeleton-region-label")).toHaveClass(
      "h-4",
      "w-20",
      "mb-2",
    );
    expect(screen.getByTestId("skeleton-postal-code-label")).toHaveClass(
      "h-4",
      "w-20",
      "mb-2",
    );
    expect(screen.getByTestId("skeleton-country-label")).toHaveClass(
      "h-4",
      "w-16",
      "mb-2",
    );

    // Check inputs
    expect(screen.getByTestId("skeleton-street-input")).toHaveClass(
      "h-10",
      "w-full",
    );
    expect(screen.getByTestId("skeleton-city-input")).toHaveClass(
      "h-10",
      "w-full",
    );
    expect(screen.getByTestId("skeleton-region-input")).toHaveClass(
      "h-10",
      "w-full",
    );
    expect(screen.getByTestId("skeleton-postal-code-input")).toHaveClass(
      "h-10",
      "w-full",
    );
    expect(screen.getByTestId("skeleton-country-input")).toHaveClass(
      "h-10",
      "w-full",
    );
  });

  it("renders exactly five field skeletons", () => {
    render(<PersonalAddressSkeleton />);

    const container = screen.getByTestId("personal-address-skeleton");
    expect(container.children).toHaveLength(5);
  });

  it("renders fields in correct order", () => {
    render(<PersonalAddressSkeleton />);

    const container = screen.getByTestId("personal-address-skeleton");
    const fieldTestIds = Array.from(container.children).map((child) =>
      child.getAttribute("data-testid"),
    );

    expect(fieldTestIds).toEqual([
      "skeleton-street-field",
      "skeleton-city-field",
      "skeleton-region-field",
      "skeleton-postal-code-field",
      "skeleton-country-field",
    ]);
  });

  it("only street field has full width span", () => {
    render(<PersonalAddressSkeleton />);

    const streetField = screen.getByTestId("skeleton-street-field");
    const cityField = screen.getByTestId("skeleton-city-field");
    const regionField = screen.getByTestId("skeleton-region-field");
    const postalField = screen.getByTestId("skeleton-postal-code-field");
    const countryField = screen.getByTestId("skeleton-country-field");

    expect(streetField).toHaveClass("lg:col-span-2");
    expect(cityField).not.toHaveClass("lg:col-span-2");
    expect(regionField).not.toHaveClass("lg:col-span-2");
    expect(postalField).not.toHaveClass("lg:col-span-2");
    expect(countryField).not.toHaveClass("lg:col-span-2");
  });
});
