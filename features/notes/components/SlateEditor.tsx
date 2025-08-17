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
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SlateEditorProps } from "../types";
import { NotesToolbar } from "./NotesToolbar";

// Using built-in Slate.js types

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
  }, [note?.content, note]);

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
      children = (
        <code className="bg-primary/20 px-1  rounded">{children}</code>
      );
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
              !Editor.isEditor(n) &&
              LIST_TYPES.includes((n as { type: string }).type),
            split: true,
          });
        }

        if (isActive) {
          editor.setNodes({ type: "paragraph" });
          setActiveTools((prev) => {
            const newSet = new Set(prev);
            newSet.delete(format);
            return newSet;
          });
        } else if (isList) {
          editor.setNodes({ type: "list-item" as const });
          setActiveTools((prev) => new Set([...prev, format]));
        } else {
          editor.setNodes({ type: format as any });
          setActiveTools((prev) => new Set([...prev, format]));
        }

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

  const isBlockActive = (editor: Editor, format: string) => {
    try {
      const { selection } = editor;
      if (!selection) return false;

      const [match] = editor.nodes({
        at: editor.unhangRange(selection),
        match: (n: unknown) =>
          !Editor.isEditor(n) && (n as { type: string }).type === format,
      });

      const isActive = !!match;
      return isActive;
    } catch (error) {
      console.error("Error in isBlockActive:", error);
      return false;
    }
  };

  const isMarkActive = (editor: Editor, format: string) => {
    try {
      const { selection } = editor;
      if (!selection) return false;

      const marks = Editor.marks(editor);
      const isActive = marks
        ? (marks as Record<string, boolean>)[format] === true
        : false;
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
          if ((marks as Record<string, boolean>)[key] === true) {
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
            match: (n: unknown) =>
              !Editor.isEditor(n) &&
              (n as { type: string }).type !== "paragraph",
          });
          if (match) {
            const node = match[0] as { type: string };
            newActiveTools.add(node.type);
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
        <NotesToolbar
          permissions={permissions}
          activeTools={activeTools}
          onToggleMark={toggleMark}
          onToggleBlock={toggleBlock}
          onExportMarkdown={onExportMarkdown}
          onExportPDF={onExportPDF}
        />

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-auto">
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
                className="min-h-full p-4 focus:outline-none prose prose-sm max-w-none"
              />
            </Slate>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1">
            <CardTitle>{note?.title || "Untitled Note"}</CardTitle>
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
        <NotesToolbar
          permissions={permissions}
          activeTools={activeTools}
          onToggleMark={toggleMark}
          onToggleBlock={toggleBlock}
          onExportMarkdown={onExportMarkdown}
          onExportPDF={onExportPDF}
        />

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
