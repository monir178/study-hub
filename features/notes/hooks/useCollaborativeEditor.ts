import { useCallback, useEffect, useRef, useState } from "react";
import { createEditor, Descendant, Editor, Operation } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { CustomEditor, CustomElement } from "@/types/slate";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@/lib/hooks/useAuth";
import { Note, NoteOperation, CollaborativeEdit, NoteUser } from "../types";
import { NotesService } from "../services/notes.service";

const AUTOSAVE_DELAY = 3000; // 3 seconds

export function useCollaborativeEditor(note: Note | null, _roomId: string) {
  const { user } = useAuth();
  const [editor] = useState(
    () => withHistory(withReact(createEditor())) as CustomEditor,
  );
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    } as CustomElement,
  ]);
  const [collaborators, setCollaborators] = useState<NoteUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const autosaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const versionRef = useRef<number>(note?.version || 0);
  const isRemoteChangeRef = useRef(false);

  // Apply remote operations to editor
  const applyRemoteOperation = useCallback(
    (operation: NoteOperation) => {
      isRemoteChangeRef.current = true;

      try {
        // Convert our operation format to Slate operations
        const slateOp = convertToSlateOperation(operation);
        if (slateOp) {
          Editor.withoutNormalizing(editor, () => {
            editor.apply(slateOp);
          });
        }
      } catch (error) {
        console.error("Failed to apply remote operation:", error);
      }

      isRemoteChangeRef.current = false;
    },
    [editor],
  );

  // Initialize editor value from note content
  useEffect(() => {
    if (note?.content) {
      try {
        const parsedContent = JSON.parse(note.content);
        setValue(parsedContent);
        versionRef.current = note.version;
      } catch {
        // Fallback for plain text content
        setValue([
          {
            type: "paragraph",
            children: [{ text: note.content }],
          } as CustomElement,
        ]);
      }
    }
  }, [note?.id, note?.content, note?.version]);

  // Setup Pusher connection for real-time collaboration
  useEffect(() => {
    if (!note?.id || !user?.id) return;

    const channel = pusherClient.subscribe(`note-${note.id}`);

    channel.bind("pusher:subscription_succeeded", () => {
      setIsConnected(true);
    });

    channel.bind("operation", (data: CollaborativeEdit) => {
      if (data.userId !== user.id) {
        applyRemoteOperation(data.operation);
      }
    });

    channel.bind("user-joined", (userData: NoteUser) => {
      if (userData.id !== user.id) {
        setCollaborators((prev) => [
          ...prev.filter((u) => u.id !== userData.id),
          userData,
        ]);
      }
    });

    channel.bind("user-left", (userData: { id: string }) => {
      setCollaborators((prev) => prev.filter((u) => u.id !== userData.id));
    });

    channel.bind(
      "cursor-update",
      (data: { userId: string; selection: unknown }) => {
        if (data.userId !== user.id) {
          setCollaborators((prev) =>
            prev.map((collab) =>
              collab.id === data.userId
                ? { ...collab, selection: data.selection }
                : collab,
            ),
          );
        }
      },
    );

    // Announce user presence
    if (user) {
      NotesService.joinNote(note.id, {
        id: user.id,
        name: user.name || "Anonymous",
        image: user.image || undefined,
        isActive: true,
      });
    }

    return () => {
      if (user) {
        NotesService.leaveNote(note.id, user.id);
      }
      pusherClient.unsubscribe(`note-${note.id}`);
      setIsConnected(false);
    };
  }, [note?.id, user?.id, user, applyRemoteOperation]);

  // Convert our operation format to Slate operation
  const convertToSlateOperation = (
    operation: NoteOperation,
  ): Operation | null => {
    switch (operation.type) {
      case "insert_text":
        return {
          type: "insert_text",
          path: operation.path,
          offset: operation.offset || 0,
          text: operation.text || "",
        };
      case "delete_text":
        return {
          type: "remove_text",
          path: operation.path,
          offset: operation.offset || 0,
          text: operation.text || "",
        };
      default:
        return null;
    }
  };

  // Convert Slate operation to our format
  const convertFromSlateOperation = (
    operation: Operation,
  ): NoteOperation | null => {
    switch (operation.type) {
      case "insert_text":
        return {
          type: "insert_text",
          path: operation.path,
          offset: operation.offset,
          text: operation.text,
        };
      case "remove_text":
        return {
          type: "delete_text",
          path: operation.path,
          offset: operation.offset,
          text: operation.text,
        };
      default:
        return null;
    }
  };

  // Handle editor changes
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);

      // Don't broadcast remote changes back
      if (isRemoteChangeRef.current) return;

      const operations = editor.operations.filter(
        (op) => op.type === "insert_text" || op.type === "remove_text",
      );

      // Broadcast operations to other users
      if (operations.length > 0 && note?.id && user?.id) {
        operations.forEach((op) => {
          const noteOp = convertFromSlateOperation(op);
          if (noteOp) {
            const edit: CollaborativeEdit = {
              id: `${Date.now()}-${Math.random()}`,
              operation: noteOp,
              userId: user.id,
              userName: user.name || "Anonymous",
              timestamp: new Date().toISOString(),
              version: versionRef.current + 1,
            };

            NotesService.broadcastOperation(note.id, edit);
          }
        });
      }

      // Broadcast cursor position if selection changed
      const hasSelectionOperation = editor.operations.some(
        (op) => op.type === "set_selection",
      );
      if (hasSelectionOperation && note?.id && user?.id && editor.selection) {
        NotesService.broadcastCursor(note.id, {
          userId: user.id,
          selection: editor.selection,
        });
      }

      // Auto-save
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      autosaveTimeoutRef.current = setTimeout(() => {
        saveNote(newValue);
      }, AUTOSAVE_DELAY);
    },
    [editor.operations, editor.selection, note?.id, user?.id, user?.name],
  );

  // Save note to server
  const saveNote = useCallback(
    async (content: Descendant[]) => {
      if (!note?.id || !user?.id) return;

      setIsSaving(true);
      try {
        const serializedContent = JSON.stringify(content);
        await NotesService.updateNote({
          id: note.id,
          content: serializedContent,
          version: versionRef.current,
        });

        versionRef.current += 1;
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save note:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [note?.id, user?.id],
  );

  // Manual save
  const save = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    saveNote(value);
  }, [value, saveNote]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    editor,
    value,
    setValue: handleChange,
    collaborators,
    isConnected,
    isSaving,
    lastSaved,
    save,
  };
}
