"use client";

import React, { useState, useCallback } from "react";
import { useUserNotes } from "../hooks/useUserNotes";
import { UserNote } from "../types";
import { useRoomMembers } from "@/features/rooms/hooks/useRoomMembers";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserNotesList } from "./UserNotesList";
import { UserNoteViewer } from "./UserNoteViewer";
import { renderSlateContent, slateToMarkdown } from "../utils/slate-utils";
import { UserNotesContainerSkeleton } from "./skeletons";

interface UserNotesContainerProps {
  initialPage?: number;
  limit?: number;
}

export function UserNotesContainer({
  initialPage = 1,
  limit = 10,
}: UserNotesContainerProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(initialPage);
  const [allNotes, setAllNotes] = useState<UserNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<UserNote | null>(null);
  const [titleValue, setTitleValue] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { data, isLoading, error } = useUserNotes(page, limit);

  // Accumulate notes when new data comes in
  React.useEffect(() => {
    if (data?.notes) {
      if (page === 1) {
        // First page, replace all notes
        setAllNotes(data.notes);
      } else {
        // Subsequent pages, append new notes
        setAllNotes((prev) => {
          const existingIds = new Set(prev.map((note) => note.id));
          const newNotes = data.notes.filter(
            (note) => !existingIds.has(note.id),
          );
          return [...prev, ...newNotes];
        });
      }
    }
  }, [data?.notes, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleNoteSelect = (note: UserNote) => {
    setSelectedNote(note);
    setTitleValue(note.title);
  };

  const handleTitleSave = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const handleTitleCancel = useCallback(() => {
    setTitleValue(selectedNote?.title || "Untitled Note");
    setIsEditingTitle(false);
  }, [selectedNote?.title]);

  // Check if user is a member of the selected note's room
  const isUserMemberOfRoom = selectedNote
    ? selectedNote.room.members?.some(
        (member) => member.userId === currentUser?.id,
      )
    : false;

  // Room membership actions - same as StudyRoomCard
  const { actions: memberActions } = useRoomMembers({
    roomId: selectedNote?.roomId || "",
    initialRoom: selectedNote
      ? {
          id: selectedNote.roomId,
          name: selectedNote.room.name,
          description: "",
          isPublic: selectedNote.room.isPublic,
          maxMembers: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          creator: { id: "", name: "", role: "USER" },
          members: [],
          memberCount: 0,
          messageCount: 0,
          noteCount: 0,
          isJoined: isUserMemberOfRoom,
          onlineMembers: 0,
        }
      : {
          id: "",
          name: "",
          description: "",
          isPublic: true,
          maxMembers: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          creator: { id: "", name: "", role: "USER" },
          members: [],
          memberCount: 0,
          messageCount: 0,
          noteCount: 0,
          isJoined: false,
          onlineMembers: 0,
        },
  });

  const handleRoomAction = async () => {
    if (!selectedNote) return;

    if (isUserMemberOfRoom) {
      // User is already a member, just enter the room
      router.push(`/dashboard/rooms/${selectedNote.roomId}`);
    } else {
      // User is not a member, join the room first (same as StudyRoomCard)
      setIsJoining(true);
      try {
        await memberActions.joinRoom();
        // After successful join, navigate to the room
        router.push(`/dashboard/rooms/${selectedNote.roomId}`);
      } catch (error) {
        console.error("Failed to join room:", error);
      } finally {
        setIsJoining(false);
      }
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load notes
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  // Show skeleton when loading and no data
  if (isLoading && !data) {
    return <UserNotesContainerSkeleton />;
  }

  const notes = allNotes;
  const pagination = data?.pagination;

  return (
    <div className="h-full flex">
      <UserNotesList
        notes={notes}
        selectedNote={selectedNote}
        pagination={pagination}
        isLoading={isLoading}
        onNoteSelect={handleNoteSelect}
        onLoadMore={handleLoadMore}
      />

      <UserNoteViewer
        selectedNote={selectedNote}
        titleValue={titleValue}
        isEditingTitle={isEditingTitle}
        isJoining={isJoining}
        isUserMemberOfRoom={isUserMemberOfRoom}
        loading={isLoading}
        onTitleChange={setTitleValue}
        onStartEdit={() => setIsEditingTitle(true)}
        onTitleSave={handleTitleSave}
        onTitleCancel={handleTitleCancel}
        onRoomAction={handleRoomAction}
        renderSlateContent={renderSlateContent}
        slateToMarkdown={slateToMarkdown}
      />
    </div>
  );
}
