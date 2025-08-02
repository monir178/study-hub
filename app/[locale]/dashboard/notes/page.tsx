import { UserNotesContainer } from "@/features/notes/components/UserNotesContainer";

export default function NotesPage() {
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="h-full">
        <UserNotesContainer />
      </div>
    </div>
  );
}
