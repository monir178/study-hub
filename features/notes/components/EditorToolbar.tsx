"use client";

import { Editor, Transforms, Element as SlateElement } from "slate";
import { useSlate } from "slate-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomElement } from "@/types/slate";
import {
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

interface EditorToolbarProps {
  className?: string;
}

export function EditorToolbar({ className }: EditorToolbarProps) {
  const editor = useSlate();

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const toggleBlock = (format: string) => {
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

  return (
    <div
      className={`flex items-center gap-1 p-2 border-b bg-muted/30 ${className}`}
    >
      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          active={isMarkActive(editor, "bold")}
          onMouseDown={() => toggleMark("bold")}
          icon={<Bold className="w-4 h-4" />}
          tooltip="Bold (Ctrl+B)"
        />
        <ToolbarButton
          active={isMarkActive(editor, "italic")}
          onMouseDown={() => toggleMark("italic")}
          icon={<Italic className="w-4 h-4" />}
          tooltip="Italic (Ctrl+I)"
        />
        <ToolbarButton
          active={isMarkActive(editor, "underline")}
          onMouseDown={() => toggleMark("underline")}
          icon={<Underline className="w-4 h-4" />}
          tooltip="Underline (Ctrl+U)"
        />
        <ToolbarButton
          active={isMarkActive(editor, "code")}
          onMouseDown={() => toggleMark("code")}
          icon={<Code className="w-4 h-4" />}
          tooltip="Code (Ctrl+`)"
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Block formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          active={isBlockActive(editor, "heading-one")}
          onMouseDown={() => toggleBlock("heading-one")}
          icon={<Heading1 className="w-4 h-4" />}
          tooltip="Heading 1"
        />
        <ToolbarButton
          active={isBlockActive(editor, "heading-two")}
          onMouseDown={() => toggleBlock("heading-two")}
          icon={<Heading2 className="w-4 h-4" />}
          tooltip="Heading 2"
        />
        <ToolbarButton
          active={isBlockActive(editor, "heading-three")}
          onMouseDown={() => toggleBlock("heading-three")}
          icon={<Heading3 className="w-4 h-4" />}
          tooltip="Heading 3"
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists and quotes */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          active={isBlockActive(editor, "bulleted-list")}
          onMouseDown={() => toggleBlock("bulleted-list")}
          icon={<List className="w-4 h-4" />}
          tooltip="Bullet List"
        />
        <ToolbarButton
          active={isBlockActive(editor, "numbered-list")}
          onMouseDown={() => toggleBlock("numbered-list")}
          icon={<ListOrdered className="w-4 h-4" />}
          tooltip="Numbered List"
        />
        <ToolbarButton
          active={isBlockActive(editor, "block-quote")}
          onMouseDown={() => toggleBlock("block-quote")}
          icon={<Quote className="w-4 h-4" />}
          tooltip="Quote"
        />
      </div>
    </div>
  );
}

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

// Helper functions
const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as Record<string, boolean>)[format] === true : false;
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
