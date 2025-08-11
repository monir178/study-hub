import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => (
    <div data-testid="join-private-dialog-root">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => (
    <input data-testid="join-private-dialog-input" {...props} />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...rest }: any) => <label {...rest}>{children}</label>,
}));

jest.mock("@/components/ui/alert", () => ({
  Alert: ({ children }: any) => <div>{children}</div>,
  AlertDescription: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="join-private-dialog-button" {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/features/rooms/hooks/useRooms", () => ({
  useJoinRoom: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

import { JoinPrivateRoomDialog } from "@/features/rooms/components/JoinPrivateRoomDialog";

describe("JoinPrivateRoomDialog", () => {
  it("renders root", () => {
    render(<JoinPrivateRoomDialog isOpen={true} onOpenChange={() => {}} />);
    expect(screen.getByTestId("join-private-dialog-root")).toBeInTheDocument();
  });
});
