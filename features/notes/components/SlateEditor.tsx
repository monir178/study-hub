"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  FileText,
  FileDown,
  Lock,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Note, NoteEditorState } from "../types";

// Using built-in Slate.js types

interface SlateEditorProps {
  note?: Note;
  isLoading: boolean;
  editorState: NoteEditorState;
  permissions: {
    canEdit: boolean;
    canExport: boolean;
    canRead: boolean;
  };
  onSave: (content: string, title: string) => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
  onChange?: (content: string, title: string) => void;
  hideHeader?: boolean;
  isSaving: boolean;
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export function SlateEditor({
  note,
  isLoading,
  editorState,
  permissions,
  onSave,
  onExportMarkdown,
  onExportPDF,
  onChange,
  hideHeader = false,
  isSaving,
}: SlateEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [title, setTitle] = useState(note?.title || "Untitled Note");
  const [, setSelection] = useState(editor.selection);
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set());
  const [key, setKey] = useState(0); // Force re-render when note changes

  // Initialize editor with note content
  useEffect(() => {
    console.log("SlateEditor: note changed", note);
    console.log("SlateEditor: note content type", typeof note?.content);
    console.log("SlateEditor: note content value", note?.content);

    if (note?.content) {
      try {
        console.log("SlateEditor: parsing content", note.content);
        const content = JSON.parse(note.content);
        console.log("SlateEditor: parsed content", content);
        setValue(content);
        setKey((prev) => prev + 1); // Force re-render
      } catch (error) {
        console.error("Error parsing note content:", error);
        setValue(initialValue);
        setKey((prev) => prev + 1); // Force re-render
      }
    } else {
      console.log("SlateEditor: no content, using initial value");
      setValue(initialValue);
      setKey((prev) => prev + 1); // Force re-render
    }
  }, [note?.content]);

  // Update title when note changes
  useEffect(() => {
    if (note?.title) {
      setTitle(note.title);
    }
  }, [note]);

  // Ensure value is never undefined and always has at least one element
  const safeValue = value && value.length > 0 ? value : initialValue;

  // Handle manual save
  const handleSave = useCallback(() => {
    const content = JSON.stringify(value);
    onSave(content, title);
  }, [value, title, onSave]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      const content = JSON.stringify(value);
      onChange(content, title);
    }
  }, [value, title, onChange]);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "block-quote":
        return (
          <blockquote
            {...props.attributes}
            className="border-l-4 border-gray-300 pl-4 my-2"
          >
            {props.children}
          </blockquote>
        );
      case "bulleted-list":
        return (
          <ul {...props.attributes} className="list-disc list-inside my-2">
            {props.children}
          </ul>
        );
      case "heading-one":
        return (
          <h1 {...props.attributes} className="text-2xl font-bold my-2">
            {props.children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...props.attributes} className="text-xl font-bold my-2">
            {props.children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 {...props.attributes} className="text-lg font-bold my-2">
            {props.children}
          </h3>
        );
      case "list-item":
        return <li {...props.attributes}>{props.children}</li>;
      case "numbered-list":
        return (
          <ol {...props.attributes} className="list-decimal list-inside my-2">
            {props.children}
          </ol>
        );
      default:
        return (
          <p {...props.attributes} className="my-1">
            {props.children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, leaf } = props;
    let { children } = props;

    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.code) {
      children = <code className="bg-gray-100 px-1 rounded">{children}</code>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
  }, []);

  const toggleBlock = useCallback(
    (format: string) => {
      try {
        const isActive = isBlockActive(editor, format);
        const isList = LIST_TYPES.includes(format);

        if (isList) {
          // Unwrap any existing list items
          editor.unwrapNodes({
            match: (n: unknown) =>
              !Editor.isEditor(n) && LIST_TYPES.includes((n as any).type),
            split: true,
          });
        }

        let newProperties: any;
        if (isActive) {
          newProperties = { type: "paragraph" };
          setActiveTools((prev) => {
            const newSet = new Set(prev);
            newSet.delete(format);
            return newSet;
          });
        } else if (isList) {
          newProperties = { type: "list-item" };
          setActiveTools((prev) => new Set([...prev, format]));
        } else {
          newProperties = { type: format };
          setActiveTools((prev) => new Set([...prev, format]));
        }
        editor.setNodes(newProperties);

        if (!isActive && isList) {
          // Wrap the list items in the list type
          const list = { type: format as any, children: [] };
          editor.wrapNodes(list);
        }
      } catch (error) {
        console.error("Error in toggleBlock:", error);
      }
    },
    [editor],
  );

  const toggleMark = useCallback(
    (format: string) => {
      try {
        const isActive = isMarkActive(editor, format);

        if (isActive) {
          editor.removeMark(format);
          setActiveTools((prev) => {
            const newSet = new Set(prev);
            newSet.delete(format);
            return newSet;
          });
        } else {
          editor.addMark(format, true);
          setActiveTools((prev) => new Set([...prev, format]));
        }
      } catch (error) {
        console.error("Error in toggleMark:", error);
      }
    },
    [editor],
  );

  const isBlockActive = (editor: any, format: string) => {
    try {
      const { selection } = editor;
      if (!selection) return false;

      const [match] = editor.nodes({
        at: editor.unhangRange(selection),
        match: (n: any) => !Editor.isEditor(n) && n.type === format,
      });

      const isActive = !!match;
      return isActive;
    } catch (error) {
      console.error("Error in isBlockActive:", error);
      return false;
    }
  };

  const isMarkActive = (editor: any, format: string) => {
    try {
      const { selection } = editor;
      if (!selection) return false;

      const marks = Editor.marks(editor);
      const isActive = marks ? (marks as any)[format] === true : false;
      return isActive;
    } catch (error) {
      console.error("Error in isMarkActive:", error);
      return false;
    }
  };

  // Sync active tools with current editor state
  const syncActiveTools = useCallback(() => {
    try {
      const newActiveTools = new Set<string>();

      // Check marks (bold, italic, underline, code)
      const marks = Editor.marks(editor);
      if (marks) {
        Object.keys(marks).forEach((key) => {
          if ((marks as any)[key] === true) {
            newActiveTools.add(key);
          }
        });
      }

      // Check blocks (headings, lists, quotes)
      const { selection } = editor;
      if (selection) {
        try {
          const [match] = editor.nodes({
            at: editor.unhangRange(selection),
            match: (n: any) => !Editor.isEditor(n) && n.type !== "paragraph",
          });
          if (match) {
            newActiveTools.add((match as any).type);
          }
        } catch (selectionError) {
          console.warn("Error checking block selection:", selectionError);
        }
      }

      setActiveTools(newActiveTools);
    } catch (error) {
      console.error("Error in syncActiveTools:", error);
      // Reset to empty set on error
      setActiveTools(new Set());
    }
  }, [editor]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (hideHeader) {
    return (
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b mb-2 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("bold") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("bold")}
                  disabled={!permissions.canEdit}
                >
                  <Bold className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("italic") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("italic")}
                  disabled={!permissions.canEdit}
                >
                  <Italic className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("underline") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("underline")}
                  disabled={!permissions.canEdit}
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("code") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("code")}
                  disabled={!permissions.canEdit}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("heading-one") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleBlock("heading-one")}
                  disabled={!permissions.canEdit}
                >
                  <Heading1 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("heading-two") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleBlock("heading-two")}
                  disabled={!permissions.canEdit}
                >
                  <Heading2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    activeTools.has("heading-three") ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleBlock("heading-three")}
                  disabled={!permissions.canEdit}
                >
                  <Heading3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    activeTools.has("bulleted-list") ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleBlock("bulleted-list")}
                  disabled={!permissions.canEdit}
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    activeTools.has("numbered-list") ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleBlock("numbered-list")}
                  disabled={!permissions.canEdit}
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("block-quote") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleBlock("block-quote")}
                  disabled={!permissions.canEdit}
                >
                  <Quote className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quote</TooltipContent>
            </Tooltip>

            {!permissions.canEdit && (
              <div className="ml-auto">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Read Only
                </Badge>
              </div>
            )}
          </TooltipProvider>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <Slate
            key={key}
            editor={editor}
            initialValue={safeValue}
            onChange={(newValue) => {
              setValue(newValue);
              setSelection(editor.selection);
              syncActiveTools();
            }}
            onSelectionChange={(newSelection) => {
              setSelection(newSelection);
              syncActiveTools();
            }}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Start writing your note..."
              readOnly={!permissions.canEdit}
              className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
            />
          </Slate>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="w-5 h-5" />
            {permissions.canEdit ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="max-w-md"
              />
            ) : (
              <CardTitle>{note?.title || "Untitled Note"}</CardTitle>
            )}
          </div>
          <div className="flex items-center gap-2">
            {permissions.canEdit && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </Button>
            )}
            {!permissions.canEdit && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Read Only
              </Badge>
            )}
            {editorState.hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600">
                Unsaved
              </Badge>
            )}
            {isSaving && (
              <Badge variant="outline" className="text-blue-600">
                Saving...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b mb-4 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("bold") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("bold")}
                  disabled={!permissions.canEdit}
                >
                  <Bold className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("italic") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("italic")}
                  disabled={!permissions.canEdit}
                >
                  <Italic className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("underline") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("underline")}
                  disabled={!permissions.canEdit}
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("code") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMark("code")}
                  disabled={!permissions.canEdit}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Code</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("heading-one") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleBlock("heading-one")}
                  disabled={!permissions.canEdit}
                >
                  <Heading1 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("heading-two") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleBlock("heading-two")}
                  disabled={!permissions.canEdit}
                >
                  <Heading2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    activeTools.has("heading-three") ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleBlock("heading-three")}
                  disabled={!permissions.canEdit}
                >
                  <Heading3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    activeTools.has("bulleted-list") ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleBlock("bulleted-list")}
                  disabled={!permissions.canEdit}
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    activeTools.has("numbered-list") ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleBlock("numbered-list")}
                  disabled={!permissions.canEdit}
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTools.has("block-quote") ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleBlock("block-quote")}
                  disabled={!permissions.canEdit}
                >
                  <Quote className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quote</TooltipContent>
            </Tooltip>

            <div className="ml-auto flex items-center gap-1">
              {permissions.canExport && onExportMarkdown && onExportPDF && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onExportMarkdown}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export as Markdown</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={onExportPDF}>
                        <FileDown className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export as PDF</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </TooltipProvider>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <Slate
            key={key}
            editor={editor}
            initialValue={safeValue}
            onChange={(newValue) => {
              setValue(newValue);
              setSelection(editor.selection);
              syncActiveTools();
            }}
            onSelectionChange={(newSelection) => {
              setSelection(newSelection);
              syncActiveTools();
            }}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Start writing your note..."
              readOnly={!permissions.canEdit}
              className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
            />
          </Slate>
        </div>
      </CardContent>
    </Card>
  );
}
