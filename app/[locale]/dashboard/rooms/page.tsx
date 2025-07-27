import { Metadata } from "next";
import { StudyRoomList } from "@/features/rooms/components/StudyRoomList";

export const metadata: Metadata = {
  title: "Study Rooms | StudyHub",
  description: "Join collaborative study sessions with other learners",
};

export default function RoomsPage() {
  return (
    <div className="container mx-auto py-8">
      <StudyRoomList />
    </div>
  );
}
