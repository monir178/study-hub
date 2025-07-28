"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Plus,
  Save,
  Download,
  Share,
  // Eye,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Clock,
} from "lucide-react";

interface CollaborativeNotesProps {
  roomId: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  collaborators: Array<{
    id: string;
    name: string;
    image?: string;
    isActive: boolean;
  }>;
  isPublic: boolean;
}

// eslint-disable-next-line
export function CollaborativeNotes({ roomId }: CollaborativeNotesProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - replace with actual API calls
  const [notes] = useState<Note[]>([
    {
      id: "1",
      title: "Study Plan - Week 1",
      content: `# Study Plan - Week 1

## Objectives
- Complete Chapter 1-3 of Mathematics
- Review previous assignments
- Prepare for upcoming quiz

## Schedule
### Monday
- [ ] Read Chapter 1 (2 hours)
- [ ] Practice problems 1-10

### Tuesday
- [ ] Read Chapter 2 (2 hours)
- [ ] Group discussion at 3 PM

### Wednesday
- [ ] Review and practice
- [ ] Complete assignment

## Notes
- Focus on understanding concepts rather than memorization
- Ask questions during group sessions
- Use Pomodoro technique for better focus`,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
      author: {
        id: "1",
        name: "John Doe",
        image: "/avatars/john.jpg",
      },
      collaborators: [
        {
          id: "2",
          name: "Jane Smith",
          image: "/avatars/jane.jpg",
          isActive: true,
        },
        {
          id: "3",
          name: "Bob Wilson",
          image: "/avatars/bob.jpg",
          isActive: false,
        },
      ],
      isPublic: true,
    },
    {
      id: "2",
      title: "Meeting Notes - Jan 15",
      content: `# Meeting Notes - January 15, 2024

## Attendees
- John Doe
- Jane Smith
- Bob Wilson

## Agenda
1. Review last week's progress
2. Plan upcoming study sessions
3. Discuss group project

## Key Points
- Everyone completed their assigned readings
- Need to schedule more practice sessions
- Group project deadline is next month

## Action Items
- [ ] John: Create practice quiz
- [ ] Jane: Research project topics
- [ ] Bob: Set up study schedule`,
      createdAt: "2024-01-15T15:00:00Z",
      updatedAt: "2024-01-15T15:45:00Z",
      author: {
        id: "2",
        name: "Jane Smith",
        image: "/avatars/jane.jpg",
      },
      collaborators: [
        {
          id: "1",
          name: "John Doe",
          image: "/avatars/john.jpg",
          isActive: false,
        },
      ],
      isPublic: false,
    },
  ]);

  const selectedNoteData = notes.find((note) => note.id === selectedNote);

  const handleCreateNote = () => {
    setShowCreateForm(true);
    setNoteTitle("");
    setNoteContent("");
    setSelectedNote(null);
    setIsEditing(true);
  };

  const handleSelectNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(noteId);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setIsEditing(false);
      setShowCreateForm(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving note:", { title: noteTitle, content: noteContent });
    setIsEditing(false);
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    if (selectedNoteData) {
      setNoteTitle(selectedNoteData.title);
      setNoteContent(selectedNoteData.content);
    } else {
      setNoteTitle("");
      setNoteContent("");
    }
    setIsEditing(false);
    setShowCreateForm(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-full">
      {/* Notes List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Notes
              </CardTitle>
              <Button size="sm" onClick={handleCreateNote}>
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-2 ${
                    selectedNote === note.id
                      ? "border-primary bg-muted/50"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {note.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        by {note.author.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-1">
                          {note.collaborators
                            .slice(0, 3)
                            .map((collaborator) => (
                              <Avatar
                                key={collaborator.id}
                                className="w-4 h-4 border border-background"
                              >
                                <AvatarImage
                                  src={collaborator.image}
                                  alt={collaborator.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {collaborator.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          {note.collaborators.length > 3 && (
                            <div className="w-4 h-4 rounded-full bg-muted border border-background flex items-center justify-center">
                              <span className="text-xs">
                                +{note.collaborators.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        {note.isPublic ? (
                          <Badge variant="outline" className="text-xs px-1">
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs px-1">
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note Editor */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing || showCreateForm ? (
                  <Input
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note title..."
                    className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                  />
                ) : (
                  <CardTitle className="text-lg">
                    {selectedNoteData?.title || "Select a note"}
                  </CardTitle>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedNoteData && !isEditing && !showCreateForm && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </>
                )}
                {(isEditing || showCreateForm) && (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
            {selectedNoteData && !showCreateForm && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated{" "}
                  {new Date(selectedNoteData.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {selectedNoteData.collaborators.length + 1} collaborators
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="h-full">
            {selectedNote || showCreateForm ? (
              <div className="h-full">
                {isEditing || showCreateForm ? (
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Start writing your note..."
                    className="h-full min-h-96 resize-none font-mono text-sm"
                  />
                ) : (
                  <div className="h-full">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {noteContent}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-center">
                <div>
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No note selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a note from the list or create a new one
                  </p>
                  <Button onClick={handleCreateNote}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Note
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
