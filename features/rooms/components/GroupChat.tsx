"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Reply,
  Trash2,
  Flag,
  Users,
} from "lucide-react";

interface GroupChatProps {
  roomId: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  author: {
    id: string;
    name: string;
    image?: string;
    role: "ADMIN" | "MODERATOR" | "MEMBER";
  };
  type: "message" | "system";
  replyTo?: {
    id: string;
    content: string;
    author: string;
  };
}

// eslint-disable-next-line
export function GroupChat({ roomId }: GroupChatProps) {
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual API calls
  const [messages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to the study room! Let's have a productive session.",
      timestamp: "2024-01-15T10:00:00Z",
      author: {
        id: "1",
        name: "John Doe",
        image: "/avatars/john.jpg",
        role: "ADMIN",
      },
      type: "message",
    },
    {
      id: "2",
      content: "Jane Smith joined the room",
      timestamp: "2024-01-15T10:05:00Z",
      author: {
        id: "system",
        name: "System",
        role: "ADMIN",
      },
      type: "system",
    },
    {
      id: "3",
      content: "Hi everyone! Ready to tackle Chapter 3 today?",
      timestamp: "2024-01-15T10:06:00Z",
      author: {
        id: "2",
        name: "Jane Smith",
        image: "/avatars/jane.jpg",
        role: "MODERATOR",
      },
      type: "message",
    },
    {
      id: "4",
      content:
        "Absolutely! I've prepared some practice problems we can work through together.",
      timestamp: "2024-01-15T10:07:00Z",
      author: {
        id: "3",
        name: "Bob Wilson",
        image: "/avatars/bob.jpg",
        role: "MEMBER",
      },
      type: "message",
      replyTo: {
        id: "3",
        content: "Hi everyone! Ready to tackle Chapter 3 today?",
        author: "Jane Smith",
      },
    },
    {
      id: "5",
      content: "Bob Wilson started a Pomodoro timer (25 minutes)",
      timestamp: "2024-01-15T10:10:00Z",
      author: {
        id: "system",
        name: "System",
        role: "ADMIN",
      },
      type: "system",
    },
    {
      id: "6",
      content: "Great! Let's focus on the integration problems first.",
      timestamp: "2024-01-15T10:11:00Z",
      author: {
        id: "1",
        name: "John Doe",
        image: "/avatars/john.jpg",
        role: "ADMIN",
      },
      type: "message",
    },
  ]);

  const [onlineUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      image: "/avatars/john.jpg",
      status: "online",
      role: "ADMIN",
    },
    {
      id: "2",
      name: "Jane Smith",
      image: "/avatars/jane.jpg",
      status: "studying",
      role: "MODERATOR",
    },
    {
      id: "3",
      name: "Bob Wilson",
      image: "/avatars/bob.jpg",
      status: "online",
      role: "MEMBER",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement send message functionality
      console.log("Sending message:", message);
      if (replyingTo) {
        console.log("Replying to:", replyingTo);
      }
      setMessage("");
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-red-600";
      case "MODERATOR":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "studying":
        return "bg-blue-500";
      case "break":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4 h-full">
      {/* Chat Messages */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              Group Chat
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.type === "system" ? (
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {msg.content}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex gap-3 group">
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarImage
                            src={msg.author.image}
                            alt={msg.author.name}
                          />
                          <AvatarFallback className="text-xs">
                            {msg.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-medium ${getRoleColor(msg.author.role)}`}
                            >
                              {msg.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>

                          {msg.replyTo && (
                            <div className="bg-muted/50 border-l-2 border-muted-foreground/20 pl-3 py-2 mb-2 text-sm">
                              <div className="text-xs text-muted-foreground mb-1">
                                Replying to {msg.replyTo.author}
                              </div>
                              <div className="text-muted-foreground truncate">
                                {msg.replyTo.content}
                              </div>
                            </div>
                          )}

                          <p className="text-sm break-words">{msg.content}</p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleReply(msg)}>
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-6 py-2 bg-muted/50 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Replying to </span>
                    <span className="font-medium">
                      {replyingTo.author.name}
                    </span>
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      {replyingTo.content}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-6 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Online ({onlineUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                        user.status,
                      )}`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${getRoleColor(user.role)}`}
                    >
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
