"use client";

import { useCallback } from "react";
import {
  Slate,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Editor, Transforms, Element as SlateElement } from "slate";
import { CustomElement, CustomText } from "@/types/slate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  Download,
  Lock,
  Unlock,
  Users,
  Wifi,
  WifiOff,
  MoreVertical,
  FileText,
  Clock,
  Bold,
  Italic,
  Underline,
  Code,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useCollaborativeEditor } from "../hooks/useCollaborativeEditor";
import { Note } from "../types";
import { formatDistanceToNow } from "date-fns";
import { NotesService } from "../services/notes.service";
import { toast } from "sonner";

interface CollaborativeEditorProps {
  note: Note | null;
  roomId: string;
  onLock?: (locked: boolean) => void;
  canLock?: boolean;
  isLocked?: boolean;
}

// Custom element renderer
const Element = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as CustomElement;
  switch (customElement.type) {
    case "heading-one":
      return (
        <h1 {...attributes} className="text-2xl font-bold mb-4">
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 {...attributes} className="text-xl font-semibold mb-3">
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 {...attributes} className="text-lg font-medium mb-2">
          {children}
        </h3>
      );
    case "block-quote":
      return (
        <blockquote
          {...attributes}
          className="border-l-4 border-muted pl-4 italic my-4"
        >
          {children}
        </blockquote>
      );
    case "list-item":
      return (
        <li {...attributes} className="ml-4">
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal ml-6 my-2">
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc ml-6 my-2">
          {children}
        </ul>
      );
    default:
      return (
        <p {...attributes} className="mb-2">
          {children}
        </p>
      );
  }
};

// Custom leaf renderer
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText;

  if (customLeaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (customLeaf.italic) {
    children = <em>{children}</em>;
  }

  if (customLeaf.underline) {
    children = <u>{children}</u>;
  }

  if (customLeaf.code) {
    children = (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  return <span {...attributes}>{children}</span>;
};

export function CollaborativeEditor({
  note,
  roomId,
  onLock,
  canLock = false,
  isLocked = false,
}: CollaborativeEditorProps) {
  const {
    editor,
    value,
    setValue,
    collaborators,
    isConnected,
    isSaving,
    lastSaved,
    save,
  } = useCollaborativeEditor(note, roomId);

  // Keyboard shortcuts
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      switch (event.key) {
        case "s": {
          event.preventDefault();
          save();
          break;
        }
        case "b": {
          event.preventDefault();
          toggleMark(editor, "bold");
          break;
        }
        case "i": {
          event.preventDefault();
          toggleMark(editor, "italic");
          break;
        }
        case "u": {
          event.preventDefault();
          toggleMark(editor, "underline");
          break;
        }
        case "`": {
          event.preventDefault();
          toggleMark(editor, "code");
          break;
        }
      }
    },
    [editor, save],
  );

  // Handle export
  const handleExport = async (format: "markdown" | "pdf") => {
    if (!note?.id) return;

    try {
      const blob = await NotesService.exportNote(note.id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${note.title}.${format === "pdf" ? "pdf" : "md"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Note exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Failed to export note");
    }
  };

  // Handle lock toggle
  const handleLockToggle = () => {
    if (onLock) {
      onLock(!isLocked);
    }
  };

  if (!note) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No note selected</h3>
            <p className="text-muted-foreground">
              Select a note from the sidebar to start editing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">{note.title}</CardTitle>
            {isLocked && (
              <Badge variant="secondary" className="text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {/* Collaborators */}
            {collaborators.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="flex -space-x-1">
                  {collaborators.slice(0, 3).map((collaborator) => (
                    <Avatar
                      key={collaborator.id}
                      className="w-6 h-6 border-2 border-background"
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
                  {collaborators.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs">
                        +{collaborators.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Save status */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Saving...
                </>
              ) : lastSaved ? (
                <>
                  <Clock className="w-3 h-3" />
                  Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                </>
              ) : null}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={save}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("markdown")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                {canLock && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLockToggle}>
                      {isLocked ? (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Unlock Note
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Lock Note
                        </>
                      )}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0 flex flex-col">
        <Slate editor={editor} initialValue={value} onChange={setValue}>
          {/* Toolbar - Hidden on mobile when locked */}
          {(!isLocked || canLock) && (
            <div className="border-b bg-muted/30 p-2 hidden sm:block">
              <div className="flex items-center gap-1 flex-wrap">
                {/* Text formatting */}
                <div className="flex items-center gap-1">
                  <ToolbarButton
                    active={isMarkActive(editor, "bold")}
                    onMouseDown={() => toggleMark(editor, "bold")}
                    icon={<Bold className="w-4 h-4" />}
                    tooltip="Bold (Ctrl+B)"
                  />
                  <ToolbarButton
                    active={isMarkActive(editor, "italic")}
                    onMouseDown={() => toggleMark(editor, "italic")}
                    icon={<Italic className="w-4 h-4" />}
                    tooltip="Italic (Ctrl+I)"
                  />
                  <ToolbarButton
                    active={isMarkActive(editor, "underline")}
                    onMouseDown={() => toggleMark(editor, "underline")}
                    icon={<Underline className="w-4 h-4" />}
                    tooltip="Underline (Ctrl+U)"
                  />
                  <ToolbarButton
                    active={isMarkActive(editor, "code")}
                    onMouseDown={() => toggleMark(editor, "code")}
                    icon={<Code className="w-4 h-4" />}
                    tooltip="Code (Ctrl+`)"
                  />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Block formatting */}
                <div className="flex items-center gap-1">
                  <ToolbarButton
                    active={isBlockActive(editor, "heading-one")}
                    onMouseDown={() => toggleBlock(editor, "heading-one")}
                    icon={<Heading1 className="w-4 h-4" />}
                    tooltip="Heading 1"
                  />
                  <ToolbarButton
                    active={isBlockActive(editor, "heading-two")}
                    onMouseDown={() => toggleBlock(editor, "heading-two")}
                    icon={<Heading2 className="w-4 h-4" />}
                    tooltip="Heading 2"
                  />
                  <ToolbarButton
                    active={isBlockActive(editor, "heading-three")}
                    onMouseDown={() => toggleBlock(editor, "heading-three")}
                    icon={<Heading3 className="w-4 h-4" />}
                    tooltip="Heading 3"
                  />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists and quotes */}
                <div className="flex items-center gap-1">
                  <ToolbarButton
                    active={isBlockActive(editor, "bulleted-list")}
                    onMouseDown={() => toggleBlock(editor, "bulleted-list")}
                    icon={<List className="w-4 h-4" />}
                    tooltip="Bullet List"
                  />
                  <ToolbarButton
                    active={isBlockActive(editor, "numbered-list")}
                    onMouseDown={() => toggleBlock(editor, "numbered-list")}
                    icon={<ListOrdered className="w-4 h-4" />}
                    tooltip="Numbered List"
                  />
                  <ToolbarButton
                    active={isBlockActive(editor, "block-quote")}
                    onMouseDown={() => toggleBlock(editor, "block-quote")}
                    icon={<Quote className="w-4 h-4" />}
                    tooltip="Quote"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 overflow-auto">
            <Editable
              className="h-full min-h-96 p-4 sm:p-6 focus:outline-none prose prose-sm max-w-none"
              renderElement={Element}
              renderLeaf={Leaf}
              placeholder={
                isLocked ? "This note is locked" : "Start writing your note..."
              }
              onKeyDown={onKeyDown}
              readOnly={isLocked && !canLock}
              style={{
                minHeight: "400px",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </Slate>
      </CardContent>
    </Card>
  );
}

// Helper functions for text formatting
const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as Record<string, boolean>)[format] === true : false;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = ["numbered-list", "bulleted-list"].includes(format);

  if (isList) {
    if (isActive) {
      // Unwrap list
      Transforms.unwrapNodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n as CustomElement).type === format,
        split: true,
      });
      // Convert list items to paragraphs
      Transforms.setNodes(editor, {
        type: "paragraph",
      } as Partial<CustomElement>);
    } else {
      // Convert to list items first
      Transforms.setNodes(editor, {
        type: "list-item",
      } as Partial<CustomElement>);
      // Then wrap in list
      Transforms.wrapNodes(editor, {
        type: format,
        children: [],
      } as CustomElement);
    }
  } else {
    // Handle other block types (headings, quotes, etc.)
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : format } as Partial<CustomElement>,
      {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          Editor.isBlock(editor, n),
      },
    );
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        Editor.isBlock(editor, n) &&
        (n as CustomElement).type === format,
    }),
  );

  return !!match;
};

// Toolbar Button Component
interface ToolbarButtonProps {
  active: boolean;
  onMouseDown: () => void;
  icon: React.ReactNode;
  tooltip: string;
}

function ToolbarButton({
  active,
  onMouseDown,
  icon,
  tooltip,
}: ToolbarButtonProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className="h-8 w-8 p-0"
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      title={tooltip}
    >
      {icon}
    </Button>
  );
}
