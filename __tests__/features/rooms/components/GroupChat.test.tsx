import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "u1", name: "User" } }),
}));

jest.mock("@/features/chat/hooks/useMessages", () => ({
  useMessages: () => ({ messages: [], isLoading: false, error: undefined }),
  useSendMessage: () => ({ mutateAsync: jest.fn() }),
  useUploadFile: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock("@/features/chat/hooks/useVoiceRecorder", () => ({
  useVoiceRecorder: () => ({
    isRecording: false,
    isUploading: false,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    cancelRecording: jest.fn(),
  }),
}));

jest.mock("@/components/ui/chat/chat-message-list", () => ({
  ChatMessageList: ({ children }: any) => (
    <div data-testid="group-chat-root">{children}</div>
  ),
}));

jest.mock("@/components/ui/chat/chat-input", () => ({
  ChatInput: (props: any) => (
    <input data-testid="group-chat-input" {...props} />
  ),
}));

jest.mock("@/components/ui/chat/chat-bubble", () => ({
  ChatBubble: ({ children }: any) => <div>{children}</div>,
  ChatBubbleAvatar: ({ children }: any) => <div>{children}</div>,
  ChatBubbleMessage: ({ children }: any) => <div>{children}</div>,
  ChatBubbleTimestamp: ({ children }: any) => <div>{children}</div>,
  ChatBubbleAction: ({ children, ...rest }: any) => (
    <button {...rest}>{children}</button>
  ),
  ChatBubbleActionWrapper: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="group-chat-button" {...rest}>
      {children}
    </button>
  ),
}));

import { GroupChat } from "@/features/rooms/components/GroupChat";

describe("GroupChat", () => {
  it("renders root", () => {
    render(<GroupChat roomId="r1" />);
    expect(screen.getByTestId("group-chat-root")).toBeInTheDocument();
  });
});
