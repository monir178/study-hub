import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { UserNote } from "../types";
import { UserNoteCard } from "./UserNoteCard";
import { UserNotesListSkeleton } from "./skeletons";

interface UserNotesListProps {
  notes: UserNote[];
  selectedNote: UserNote | null;
  pagination?: {
    totalCount: number;
    hasNextPage: boolean;
  };
  isLoading: boolean;
  onNoteSelect: (note: UserNote) => void;
  onLoadMore: () => void;
}

export function UserNotesList({
  notes,
  selectedNote,
  pagination,
  isLoading,
  onNoteSelect,
  onLoadMore,
}: UserNotesListProps) {
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  // Reset local loading state when global loading finishes
  useEffect(() => {
    if (!isLoading) {
      setIsLoadMoreLoading(false);
    }
  }, [isLoading]);

  if (isLoading && !notes.length) {
    return <UserNotesListSkeleton />;
  }

  // Show loading state for load more button when either local state or global loading
  const showLoadMoreLoading = isLoadMoreLoading || isLoading;

  return (
    <div className="w-1/2 border-r">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Public Notes
            {pagination && (
              <Badge variant="secondary" className="ml-2">
                {pagination.totalCount} total
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          {notes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join some study rooms to start creating notes
                </p>
                <Button asChild>
                  <Link href="/dashboard/rooms">
                    Browse Study Rooms
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {/* Scrollable Notes List with Load More Button Inside */}
              <ScrollArea className="h-full">
                <div className="px-6 py-6 space-y-3">
                  {notes.map((note) => (
                    <UserNoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onSelect={onNoteSelect}
                    />
                  ))}

                  {/* Load More Button Inside Scroll Area */}
                  {pagination?.hasNextPage && (
                    <div className="pt-3">
                      <Button
                        onClick={() => {
                          setIsLoadMoreLoading(true);
                          onLoadMore();
                        }}
                        disabled={showLoadMoreLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {showLoadMoreLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More Notes"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
