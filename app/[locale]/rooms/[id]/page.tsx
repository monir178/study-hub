import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomDetailView } from "@/features/rooms/components/RoomDetailView";

interface RoomPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata({
  params: _params,
}: RoomPageProps): Promise<Metadata> {
  return {
    title: `Study Room | StudyHub`,
    description: "Join collaborative study sessions with other learners",
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <RoomDetailView roomId={params.id} />
    </div>
  );
}
