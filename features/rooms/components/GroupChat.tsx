"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  useMessages,
  useSendMessage,
  useUploadFile,
} from "@/features/chat/hooks/useMessages";
import { useVoiceRecorder } from "@/features/chat/hooks/useVoiceRecorder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from "@/components/ui/chat/chat-bubble";
import { AudioPlayer } from "@/components/ui/audio-player";
import Image from "next/image";
import {
  Send,
  Paperclip,
  Mic,
  Square,
  File,
  X,
  Loader2,
  Crown,
  Shield,
  User as UserIcon,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Copy,
  Reply,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupChatProps {
  roomId: string;
}

export function GroupChat({ roomId }: GroupChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error } = useMessages(roomId);
  const sendMessage = useSendMessage();
  const uploadFile = useUploadFile();

  // Voice recorder hook
  const voiceRecorder = useVoiceRecorder({
    roomId,
    onUploadSuccess: (result) => {
      // Send voice message with URL in content
      sendMessage.mutateAsync({
        content: result.url, // Store URL in content
        type: "FILE",
        roomId,
        fileUrl: result.url,
        fileName: result.fileName,
        fileType: result.format,
      });
    },
    onUploadError: (error) => {
      console.error("Voice upload failed:", error);
    },
  });

  // Auto-scroll to bottom on first load and new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    // Set loading state immediately when user clicks send
    setIsSending(true);

    try {
      let messageContent = message.trim();
      let messageType: "TEXT" | "FILE" = "TEXT";
      let uploadResult: { url: string } | null = null;

      // Upload file if selected
      if (selectedFile) {
        uploadResult = await uploadFile.mutateAsync({
          file: selectedFile,
          roomId,
        });

        // Store the Cloudinary URL in content field
        messageContent = uploadResult.url;
        messageType = "FILE";
      }

      // Send message
      await sendMessage.mutateAsync({
        content: messageContent,
        type: messageType,
        roomId,
        fileUrl: selectedFile ? uploadResult?.url : undefined,
        fileName: selectedFile?.name,
        fileType: selectedFile?.type,
      });

      // Reset form
      setMessage("");
      handleRemoveFile();
      setUploadProgress(0);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Import toast dynamically to avoid SSR issues
      const { toast } = await import("sonner");

      // Show meaningful error message
      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          toast.error("Upload timeout - file too large or connection too slow");
        } else if (error.message.includes("File size")) {
          toast.error("File size exceeds 50MB limit");
        } else if (error.message.includes("format")) {
          toast.error("File format not supported");
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      // Always reset loading state when done (success or error)
      setIsSending(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clean up previous preview URL if exists
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }

      setSelectedFile(file);

      // Create preview URL for images (including SVG)
      if (
        file.type.startsWith("image/") ||
        file.type === "image/svg+xml" ||
        file.name.toLowerCase().endsWith(".svg")
      ) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreviewUrl(previewUrl);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    // Clean up preview URL
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear state
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-3 h-3" />;
      case "MODERATOR":
        return <Shield className="w-3 h-3" />;
      default:
        return <UserIcon className="w-3 h-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();

    if (type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    } else if (type.startsWith("video/")) {
      return <Video className="w-4 h-4 text-purple-500" />;
    } else if (type.startsWith("audio/")) {
      return <Music className="w-4 h-4 text-green-500" />;
    } else if (
      type.includes("pdf") ||
      type.includes("document") ||
      type.includes("text")
    ) {
      return <FileText className="w-4 h-4 text-orange-500" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const isImageUrl = (url: string): boolean => {
    console.log("Checking URL for image:", url);
    const isImage =
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|ico)$/i.test(url) ||
      url.includes("image/") ||
      url.includes("/image/") ||
      url.includes("svg") ||
      url.includes(".svg");
    console.log("Is image result:", isImage);
    return isImage;
  };

  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|mov|avi|webm|mkv)$/i.test(url) || url.includes("video/");
  };

  const isAudioUrl = (url: string): boolean => {
    const isAudio =
      /\.(mp3|wav|ogg|m4a|aac)$/i.test(url) || url.includes("audio/");
    console.log("Checking if URL is audio:", url, "Result:", isAudio);
    return isAudio;
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const renderFileContent = (msg: {
    content: string;
    type: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
  }) => {
    const isFileMessage = msg.type === "FILE";

    // Debug logging for SVG files
    if (isFileMessage) {
      console.log("File message data:", {
        content: msg.content,
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        fileType: msg.fileType,
        type: msg.type,
      });
    }

    // Handle both old and new file message formats
    const getFileUrl = () => {
      if (msg.content && msg.content.startsWith("http")) {
        return msg.content;
      }
      if (msg.fileUrl && msg.fileUrl.startsWith("http")) {
        return msg.fileUrl;
      }
      return null;
    };

    const fileUrl = getFileUrl();
    const isLegacyFileMessage = isFileMessage && !fileUrl;

    if (!isFileMessage) {
      return { content: msg.content, hasWrapper: true };
    }

    if (isLegacyFileMessage) {
      return {
        content: (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            {getFileIcon(msg.fileType || "")}
            <span className="text-sm font-medium">
              {msg.content || msg.fileName || "File"}
            </span>
            <span className="text-xs text-muted-foreground">
              (File not available)
            </span>
          </div>
        ),
        hasWrapper: true,
      };
    }

    if (!fileUrl) return { content: null, hasWrapper: true };

    // Image Display - No wrapper padding
    // Also check if it's an SVG based on file type or file name
    const isSvgFile =
      msg.fileType === "image/svg+xml" ||
      msg.fileName?.toLowerCase().endsWith(".svg") ||
      fileUrl.toLowerCase().includes(".svg") ||
      fileUrl.toLowerCase().includes("svg");

    console.log("SVG check:", {
      fileType: msg.fileType,
      fileName: msg.fileName,
      fileUrl: fileUrl,
      isSvgFile: isSvgFile,
      isImageUrl: isImageUrl(fileUrl),
    });

    if (isImageUrl(fileUrl) || isSvgFile) {
      return {
        content: (
          <div className="relative max-w-xs">
            <Image
              src={fileUrl}
              alt={msg.fileName || "Image"}
              width={300}
              height={200}
              className="rounded-lg object-cover"
              style={{ maxHeight: "200px" }}
            />
          </div>
        ),
        hasWrapper: false, // No bubble wrapper for images
      };
    }

    // Video Display - No wrapper padding
    if (isVideoUrl(fileUrl)) {
      return {
        content: (
          <div className="relative max-w-xs">
            <video
              src={fileUrl}
              controls
              className="rounded-lg max-h-48"
              preload="metadata"
            />
          </div>
        ),
        hasWrapper: false, // No bubble wrapper for videos
      };
    }

    // Audio Display - Custom compact player without volume controls
    if (isAudioUrl(fileUrl)) {
      console.log("Rendering audio message with custom player:", fileUrl);
      return {
        content: (
          <AudioPlayer
            key={`audio-${fileUrl}`}
            src={fileUrl}
            fileName={msg.fileName}
          />
        ),
        hasWrapper: false, // No bubble wrapper for audio
      };
    }

    // File Display (non-media) - Keep wrapper
    return {
      content: (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
          {getFileIcon(msg.fileType || "")}
          <span className="text-sm font-medium">{msg.fileName || "File"}</span>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline ml-auto"
          >
            Download
          </a>
        </div>
      ),
      hasWrapper: true,
    };
  };

  const renderMessage = (msg: {
    id: string;
    content: string;
    type: string;
    createdAt: string;
    author: {
      id: string;
      name?: string;
      image?: string;
      role?: string;
    };
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
  }) => {
    // Handle SYSTEM messages differently
    if (msg.type === "SYSTEM") {
      return (
        <div key={msg.id} className="flex justify-center my-2">
          <Badge variant="secondary" className="text-sm">
            {msg.content}
          </Badge>
        </div>
      );
    }

    const isOwnMessage = msg.author.id === user?.id;
    const timestamp = formatDistanceToNow(new Date(msg.createdAt), {
      addSuffix: true,
    });

    // Helper function to get file URL for this message
    const getMessageFileUrl = () => {
      if (msg.content && msg.content.startsWith("http")) {
        return msg.content;
      }
      if (msg.fileUrl && msg.fileUrl.startsWith("http")) {
        return msg.fileUrl;
      }
      return null;
    };

    const messageFileUrl = getMessageFileUrl();
    const isAudioMessage =
      msg.type === "FILE" && messageFileUrl && isAudioUrl(messageFileUrl);

    console.log(
      "Message type:",
      msg.type,
      "File URL:",
      messageFileUrl,
      "Is audio:",
      isAudioMessage,
    );

    return (
      <ChatBubble
        key={msg.id}
        variant={isOwnMessage ? "sent" : "received"}
        className={`max-w-[75%] sm:max-w-[65%] lg:max-w-[55%] ${
          isAudioMessage ? "mb-0" : "mb-4"
        }`}
      >
        <ChatBubbleAvatar
          src={msg.author.image || ""}
          fallback={msg.author.name?.charAt(0) || "?"}
          className="w-8 h-8 flex-shrink-0"
        />

        {isAudioMessage ? (
          // Special compact layout for audio messages
          <div className="flex flex-col min-w-0">
            {/* User info and role badge - positioned directly above audio */}
            <div
              className={`flex items-center gap-2 ${isOwnMessage ? "justify-end" : "justify-start"} -mb-20`}
            >
              <span className="text-xs font-medium text-muted-foreground truncate">
                {msg.author.name || "Unknown"}
              </span>
              <Badge
                variant="outline"
                className={`text-xs flex-shrink-0 ${getRoleBadgeColor(msg.author.role || "USER")}`}
              >
                {getRoleIcon(msg.author.role || "USER")}
                <span className="ml-1">{msg.author.role || "USER"}</span>
              </Badge>
            </div>

            {/* Audio player with minimal spacing */}
            <div className="-mt-2">
              {(() => {
                const fileContent = renderFileContent(msg);
                return fileContent.content;
              })()}
            </div>

            <ChatBubbleTimestamp timestamp={timestamp} />
          </div>
        ) : (
          // Normal layout for other messages
          <div className="flex flex-col space-y-1 min-w-0">
            {/* User info and role badge */}
            <div
              className={`flex items-center gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <span className="text-xs font-medium text-muted-foreground truncate">
                {msg.author.name || "Unknown"}
              </span>
              <Badge
                variant="outline"
                className={`text-xs flex-shrink-0 ${getRoleBadgeColor(msg.author.role || "USER")}`}
              >
                {getRoleIcon(msg.author.role || "USER")}
                <span className="ml-1">{msg.author.role || "USER"}</span>
              </Badge>
            </div>

            {(() => {
              const fileContent = renderFileContent(msg);
              console.log(
                "File content hasWrapper:",
                fileContent.hasWrapper,
                "Content type:",
                typeof fileContent.content,
              );

              // For media files (images, videos) without wrapper
              if (!fileContent.hasWrapper) {
                console.log("Rendering without wrapper");
                return fileContent.content;
              }

              // For text messages and files with wrapper
              console.log("Rendering with wrapper");
              return (
                <ChatBubbleMessage variant={isOwnMessage ? "sent" : "received"}>
                  {fileContent.content}
                </ChatBubbleMessage>
              );
            })()}

            <ChatBubbleTimestamp timestamp={timestamp} />
          </div>
        )}

        <ChatBubbleActionWrapper variant={isOwnMessage ? "sent" : "received"}>
          <ChatBubbleAction
            icon={<Copy className="w-3 h-3" />}
            onClick={() => handleCopyMessage(msg.content)}
          />
          <ChatBubbleAction
            icon={<Reply className="w-3 h-3" />}
            onClick={() => {
              setMessage(`@${msg.author.name} `);
            }}
          />
        </ChatBubbleActionWrapper>
      </ChatBubble>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Failed to load messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages and Input Area - All in one container */}
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Messages Area with Auto-scroll */}
          <div className="flex-1 min-h-0">
            <ChatMessageList smooth className="h-full [&>div>div]:space-y-1">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No messages yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map(renderMessage)
              )}
            </ChatMessageList>
          </div>

          {/* Input Area - Inside the rounded container */}
          <div className="border-t p-3 sm:p-4 space-y-3  flex-shrink-0">
            {/* File Preview */}
            {selectedFile && (
              <div className="p-2 bg-muted/50 rounded-lg">
                {filePreviewUrl ? (
                  // Image Preview
                  <div className="flex items-start gap-2">
                    <div className="relative">
                      <Image
                        src={filePreviewUrl}
                        alt={selectedFile.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                        style={{ maxHeight: "80px", maxWidth: "80px" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveFile}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  // Non-image File Preview
                  <div className="flex items-center gap-2">
                    {getFileIcon(selectedFile.type)}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveFile}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Voice Recording Indicator */}
            {voiceRecorder.isRecording && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400 flex-1">
                  Recording... {voiceRecorder.formattedTime}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={voiceRecorder.stopRecording}
                    className="h-6 w-6 p-0 text-green-600 flex-shrink-0"
                    title="Send voice message"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={voiceRecorder.cancelRecording}
                    className="h-6 w-6 p-0 text-red-600 flex-shrink-0"
                    title="Cancel recording"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploadFile.isPending && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Input and Actions */}
            <div className="flex items-center gap-2">
              <ChatInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={isSending}
                className="flex-1 min-w-0"
              />

              {/* File Upload Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
                className="h-10 w-10 p-0 flex-shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Voice Record Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (voiceRecorder.isRecording) {
                    voiceRecorder.stopRecording();
                  } else {
                    voiceRecorder.startRecording();
                  }
                }}
                disabled={isSending || voiceRecorder.isUploading}
                className={`h-10 w-10 p-0 flex-shrink-0 ${
                  voiceRecorder.isRecording ? "bg-red-100 text-red-600" : ""
                }`}
              >
                {voiceRecorder.isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : voiceRecorder.isRecording ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={
                  isSending ||
                  voiceRecorder.isRecording ||
                  voiceRecorder.isUploading ||
                  (!message.trim() && !selectedFile)
                }
                className="h-10 px-3 sm:px-4 flex-shrink-0"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx,.csv,.zip,.rar,.7z,.tar,.gz,.js,.ts,.jsx,.tsx,.html,.css,.json,.xml,.md,.epub,.mobi"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
