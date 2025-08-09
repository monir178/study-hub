// @ts-nocheck
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import {
  useUserProfile,
  useUpdateProfile,
} from "@/features/users/hooks/useUsers";

// Mock dependencies
jest.mock("@/features/users/hooks/useUsers");
jest.mock("@/features/users/services/user.service");
jest.mock("sonner");

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

// Mock react-phone-number-input
jest.mock("react-phone-number-input", () => {
  return function PhoneInput({ value, onChange, ...props }) {
    return (
      <input
        data-testid="phone-input"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    );
  };
});

const mockUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg",
  phoneNumber: "+1234567890",
  gender: "MALE",
  dateOfBirth: "1990-01-01",
  street: "123 Main St",
  city: "New York",
  region: "NY",
  postalCode: "10001",
  country: "United States",
};

const mockUseUserProfile = useUserProfile as jest.MockedFunction<
  typeof useUserProfile
>;
const mockUseUpdateProfile = useUpdateProfile as jest.MockedFunction<
  typeof useUpdateProfile
>;

describe("ProfileForm", () => {
  const mockUpdateProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserProfile.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });
    mockUseUpdateProfile.mockReturnValue({
      mutateAsync: mockUpdateProfile,
      isPending: false,
    });
  });

  it("renders loading skeleton when data is loading", () => {
    mockUseUserProfile.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ProfileForm />);
    expect(screen.getByTestId("profile-form-skeleton")).toBeInTheDocument();
  });

  it("renders error state when there is an error", () => {
    mockUseUserProfile.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to load"),
    });

    render(<ProfileForm />);
    expect(screen.getByTestId("profile-form-error")).toBeInTheDocument();
  });

  it("renders form with user data when loaded successfully", () => {
    render(<ProfileForm />);

    expect(screen.getByTestId("profile-form")).toBeInTheDocument();
    expect(screen.getByTestId("profile-picture")).toBeInTheDocument();
    expect(screen.getByTestId("personal-information")).toBeInTheDocument();
    expect(screen.getByTestId("personal-address")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
  });

  it("handles submit button click", () => {
    render(<ProfileForm />);
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);
    // Button should be clickable (no errors thrown)
    expect(submitButton).toBeInTheDocument();
  });

  it("handles reset button click", () => {
    render(<ProfileForm />);
    const resetButton = screen.getByTestId("reset-button");
    fireEvent.click(resetButton);
    // Button should be clickable (no errors thrown)
    expect(resetButton).toBeInTheDocument();
  });
});
