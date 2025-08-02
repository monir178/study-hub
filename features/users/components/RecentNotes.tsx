"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Note } from "../types";
import { RecentNotesSkeleton } from "../dashboard/components/skeletons";

interface RecentNotesProps {
  recentNotes: Note[];
  loading?: boolean;
}

export function RecentNotes({ recentNotes, loading }: RecentNotesProps) {
  if (loading) {
    return <RecentNotesSkeleton />;
  }

  return (
    <Card className="min-h-[200px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">My Recent Notes</CardTitle>
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentNotes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{note.title}</p>
                <p className="text-xs text-muted-foreground">
                  {note.room.name} •{" "}
                  {format(new Date(note.updatedAt), "MMM dd")}
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/rooms/${note.roomId}/notes/${note.id}`}>
                  Open
                </Link>
              </Button>
            </div>
          ))}
          {recentNotes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent notes</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/dashboard/notes">Browse Notes</Link>
              </Button>
            </div>
          )}
          {recentNotes.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/notes">
                View All Notes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
