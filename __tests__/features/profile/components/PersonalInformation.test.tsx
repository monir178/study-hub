// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { PersonalInformation } from "@/features/profile/components/PersonalInformation";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  gender: "MALE",
  dateOfBirth: "1990-01-01",
};

// Test wrapper component that provides form context
function TestWrapper({ children, defaultValues = {} }) {
  const methods = useForm({
    defaultValues: {
      gender: "",
      dateOfBirth: undefined,
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("PersonalInformation", () => {
  it("renders personal information fields", () => {
    render(
      <TestWrapper>
        <PersonalInformation user={mockUser} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("personal-information")).toBeInTheDocument();
    expect(screen.getByTestId("gender-field")).toBeInTheDocument();
    expect(screen.getByTestId("date-of-birth-field")).toBeInTheDocument();
  });

  it("renders field labels correctly", () => {
    render(
      <TestWrapper>
        <PersonalInformation user={mockUser} />
      </TestWrapper>,
    );

    expect(screen.getByTestId("gender-label")).toBeInTheDocument();
    expect(screen.getByTestId("date-of-birth-label")).toBeInTheDocument();
  });
});
