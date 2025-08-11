import React from "react";
import { render, screen } from "@testing-library/react";

// Mocks
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock form primitives to expose a stable testid
jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: any) => (
    <div data-testid="create-room-form-root">{children}</div>
  ),
  FormField: ({ children }: any) => <div>{children}</div>,
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormMessage: () => <div />,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormDescription: ({ children }: any) => <div>{children}</div>,
}));

// Lightweight UI stubs
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input data-testid="create-room-input" {...props} />,
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => (
    <textarea data-testid="create-room-textarea" {...props} />
  ),
}));

jest.mock("@/components/ui/slider", () => ({
  Slider: (props: any) => <div data-testid="create-room-slider" {...props} />,
}));

jest.mock("@/components/ui/switch", () => ({
  Switch: (props: any) => <input data-testid="create-room-switch" {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="create-room-button" {...rest}>
      {children}
    </button>
  ),
}));

// Hooks
jest.mock("@/features/rooms/hooks/useRooms", () => ({
  useCreateRoom: () => ({
    isPending: false,
    mutateAsync: jest.fn().mockResolvedValue({ id: "room-1" }),
  }),
}));

import { CreateRoomForm } from "@/features/rooms/components/CreateRoomForm";

describe("CreateRoomForm", () => {
  it("renders the form root", () => {
    render(<CreateRoomForm />);
    expect(screen.getByTestId("create-room-form-root")).toBeInTheDocument();
  });
});
