import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { UserNote } from "../types";

interface UserNoteCardProps {
  note: UserNote;
  isSelected: boolean;
  onSelect: (note: UserNote) => void;
}

export function UserNoteCard({
  note,
  isSelected,
  onSelect,
}: UserNoteCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
      }`}
      onClick={() => onSelect(note)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={note.creator.image || undefined} />
          <AvatarFallback>
            {note.creator.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">{note.title}</h3>
            <Badge variant="outline" className="text-xs">
              {note.room.name}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {note.creator.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(note.updatedAt), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </div>

      <ArrowRight className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}
