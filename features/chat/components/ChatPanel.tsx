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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInput } from "@/components/ui/chat/chat-input";
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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatPanelProps {
  roomId: string;
}

export function ChatPanel({ roomId }: ChatPanelProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

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
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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
    return (
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("image/")
    );
  };

  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|mov|avi|webm|mkv)$/i.test(url) || url.includes("video/");
  };

  const isAudioUrl = (url: string): boolean => {
    return /\.(mp3|wav|ogg|m4a|aac)$/i.test(url) || url.includes("audio/");
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
    const isOwnMessage = msg.author.id === user?.id;
    const isFileMessage = msg.type === "FILE";
    const timestamp = formatDistanceToNow(new Date(msg.createdAt), {
      addSuffix: true,
    });

    // Handle both old and new file message formats
    const getFileUrl = () => {
      // New format: content contains the URL
      if (msg.content && msg.content.startsWith("http")) {
        return msg.content;
      }
      // Old format: fileUrl contains the URL
      if (msg.fileUrl && msg.fileUrl.startsWith("http")) {
        return msg.fileUrl;
      }
      // Fallback: no valid URL found
      return null;
    };

    const fileUrl = getFileUrl();
    const isLegacyFileMessage = isFileMessage && !fileUrl;

    return (
      <div
        key={msg.id}
        className={`flex w-full ${
          isOwnMessage ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex gap-2 max-w-[80%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
        >
          {/* Avatar */}
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={msg.author.image || ""} />
            <AvatarFallback>{msg.author.name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <div
            className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
          >
            {/* User info and role badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {msg.author.name || "Unknown"}
              </span>
              <Badge
                variant="outline"
                className={`text-xs ${getRoleBadgeColor(msg.author.role || "USER")}`}
              >
                {getRoleIcon(msg.author.role || "USER")}
                <span className="ml-1">{msg.author.role || "USER"}</span>
              </Badge>
            </div>

            {/* Message Bubble */}
            <div
              className={`rounded-lg px-3 py-2 max-w-full ${
                isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {isFileMessage && fileUrl ? (
                <div className="space-y-2">
                  {/* Image Display */}
                  {isImageUrl(fileUrl) && (
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
                  )}

                  {/* Video Display */}
                  {isVideoUrl(fileUrl) && (
                    <div className="relative max-w-xs">
                      <video
                        src={fileUrl}
                        controls
                        className="rounded-lg max-h-48"
                        preload="metadata"
                      />
                    </div>
                  )}

                  {/* Audio Display */}
                  {isAudioUrl(fileUrl) && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Music className="w-4 h-4 text-green-500" />
                      <audio
                        src={fileUrl}
                        controls
                        className="flex-1"
                        preload="metadata"
                      />
                    </div>
                  )}

                  {/* File Display (non-media) */}
                  {!isImageUrl(fileUrl) &&
                    !isVideoUrl(fileUrl) &&
                    !isAudioUrl(fileUrl) && (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        {getFileIcon(msg.fileType || "")}
                        <span className="text-sm font-medium">
                          {msg.fileName || "File"}
                        </span>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    )}
                </div>
              ) : isLegacyFileMessage ? (
                // Legacy file message display (no URL available)
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  {getFileIcon(msg.fileType || "")}
                  <span className="text-sm font-medium">
                    {msg.content || msg.fileName || "File"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (File not available)
                  </span>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-xs text-muted-foreground mt-1">
              {timestamp}
            </span>
          </div>
        </div>
      </div>
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
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t p-4 space-y-3 bg-background">
        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            {getFileIcon(selectedFile.type)}
            <span className="text-sm flex-1">{selectedFile.name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedFile(null)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Voice Recording Indicator */}
        {voiceRecorder.isRecording && (
          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-600 dark:text-red-400">
              Recording... {voiceRecorder.formattedTime}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={voiceRecorder.cancelRecording}
              className="h-6 w-6 p-0 text-red-600"
            >
              <X className="w-3 h-3" />
            </Button>
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
            disabled={sendMessage.isPending}
            className="flex-1"
          />

          {/* File Upload Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={sendMessage.isPending}
            className="h-10 w-10 p-0"
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
            disabled={sendMessage.isPending || voiceRecorder.isUploading}
            className={`h-10 w-10 p-0 ${
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
              sendMessage.isPending || (!message.trim() && !selectedFile)
            }
            className="h-10 px-4"
          >
            {sendMessage.isPending ? (
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
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          className="hidden"
        />
      </div>
    </div>
  );
}
