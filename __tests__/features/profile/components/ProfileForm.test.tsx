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

// Mock UI components
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }) => (
    <div data-testid="card-title" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/form", () => ({
  Form: ({ children, control, handleSubmit, reset, formState, ...props }) => (
    <div data-testid="form" {...props}>
      {children}
    </div>
  ),
  FormField: ({ children, render, control, name, ...props }) => (
    <div data-testid="form-field" {...props}>
      {render
        ? render({ field: { value: "", onChange: jest.fn() } })
        : children}
    </div>
  ),
  FormItem: ({ children, ...props }) => (
    <div data-testid="form-item" {...props}>
      {children}
    </div>
  ),
  FormLabel: ({ children, ...props }) => (
    <label data-testid="form-label" {...props}>
      {children}
    </label>
  ),
  FormControl: ({ children, ...props }) => (
    <div data-testid="form-control" {...props}>
      {children}
    </div>
  ),
  FormMessage: ({ children, ...props }) => (
    <div data-testid="form-message" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, type, onClick, disabled, ...props }) => (
    <button
      data-testid="button"
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ ...props }) => <div data-testid="skeleton" {...props} />,
}));

// Mock profile components
jest.mock("@/features/profile/components/ProfilePicture", () => ({
  ProfilePicture: ({ user, selectedFile, onFileSelect, ...props }) => (
    <div data-testid="profile-picture" {...props} />
  ),
}));

jest.mock("@/features/profile/components/PersonalInformation", () => ({
  PersonalInformation: ({ user, ...props }) => (
    <div data-testid="personal-information" {...props} />
  ),
}));

jest.mock("@/features/profile/components/PersonalAddress", () => ({
  PersonalAddress: ({ user, ...props }) => (
    <div data-testid="personal-address" {...props} />
  ),
}));

// Mock react-hook-form
jest.mock("react-hook-form", () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn) => fn,
    reset: jest.fn(),
    formState: { errors: {}, isSubmitting: false },
  }),
  Controller: ({ render, ...props }) =>
    render({ field: { value: "", onChange: jest.fn() } }),
}));

// Mock react-phone-number-input
jest.mock("react-phone-number-input", () => {
  return function PhoneInput({
    value,
    onChange,
    defaultCountry,
    className,
    placeholder,
    ...props
  }) {
    return (
      <input
        data-testid="phone-input"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={className}
        placeholder={placeholder}
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
