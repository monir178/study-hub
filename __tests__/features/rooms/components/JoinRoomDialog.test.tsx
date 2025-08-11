import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => (
    <div data-testid="join-room-dialog-root">{children}</div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="join-room-dialog-button" {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => (
    <input data-testid="join-room-dialog-input" {...props} />
  ),
}));

// Mock react-hook-form to directly invoke onSubmit with a password
jest.mock("react-hook-form", () => ({
  useForm: () => ({
    handleSubmit: (fn: any) => (e?: any) => {
      if (e && e.preventDefault) e.preventDefault();
      fn({ password: "secret" });
    },
    control: {},
    reset: jest.fn(),
  }),
}));

// Make FormField call its render prop, so the Input renders
jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: any) => <div>{children}</div>,
  FormField: ({ name, render, control }: any) => (
    <div data-testid="form-field">
      {render({
        field: { value: "", onChange: () => {} },
        fieldState: {},
        formState: {},
        control,
        name,
      })}
    </div>
  ),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormMessage: () => <div />,
  FormControl: ({ children }: any) => <div>{children}</div>,
}));

import { JoinRoomDialog } from "@/features/rooms/components/JoinRoomDialog";

describe("JoinRoomDialog", () => {
  it("renders content", () => {
    render(
      <JoinRoomDialog
        open={true}
        onOpenChange={() => {}}
        onJoin={() => {}}
        roomName="Room"
      />,
    );
    expect(screen.getByTestId("join-room-dialog-root")).toBeInTheDocument();
  });

  it("submits and triggers onJoin", () => {
    const onJoin = jest.fn();
    render(
      <JoinRoomDialog
        open={true}
        onOpenChange={() => {}}
        onJoin={onJoin}
        roomName="Room"
      />,
    );
    const inputs = screen.getAllByTestId("join-room-dialog-input");
    const pwd = inputs[0] as HTMLInputElement;
    fireEvent.change(pwd, { target: { value: "secret" } });
    fireEvent.click(screen.getAllByTestId("join-room-dialog-button")[1]);
    expect(onJoin).toHaveBeenCalledWith("secret");
  });
});
