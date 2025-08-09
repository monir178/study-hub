// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { PersonalAddress } from "@/features/profile/components/PersonalAddress";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

// Mock country-list
jest.mock("country-list", () => ({
  getData: () => [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
  ],
}));

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  street: "123 Main St",
  city: "New York",
  region: "NY",
  postalCode: "10001",
  country: "United States",
};

// Test wrapper component that provides form context
function TestWrapper({ children, defaultValues = {} }) {
  const methods = useForm({
    defaultValues: {
      street: "",
      city: "",
      region: "",
      postalCode: "",
      country: "",
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("PersonalAddress", () => {
  it("renders all address fields", () => {
    render(
      <TestWrapper>
        <PersonalAddress user={mockUser} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("personal-address")).toBeInTheDocument();
    expect(screen.getByTestId("street-field")).toBeInTheDocument();
    expect(screen.getByTestId("city-field")).toBeInTheDocument();
    expect(screen.getByTestId("region-field")).toBeInTheDocument();
    expect(screen.getByTestId("postal-code-field")).toBeInTheDocument();
    expect(screen.getByTestId("country-field")).toBeInTheDocument();
  });

  it("renders field labels correctly", () => {
    render(
      <TestWrapper>
        <PersonalAddress user={mockUser} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("street-label")).toBeInTheDocument();
    expect(screen.getByTestId("city-label")).toBeInTheDocument();
    expect(screen.getByTestId("region-label")).toBeInTheDocument();
    expect(screen.getByTestId("postal-code-label")).toBeInTheDocument();
    expect(screen.getByTestId("country-label")).toBeInTheDocument();
  });

  it("renders input fields", () => {
    render(
      <TestWrapper>
        <PersonalAddress user={mockUser} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("street-input")).toBeInTheDocument();
    expect(screen.getByTestId("city-input")).toBeInTheDocument();
    expect(screen.getByTestId("region-input")).toBeInTheDocument();
    expect(screen.getByTestId("postal-code-input")).toBeInTheDocument();
    expect(screen.getByTestId("country-select")).toBeInTheDocument();
  });
});
