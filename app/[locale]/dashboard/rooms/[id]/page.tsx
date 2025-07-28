import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomDetailView } from "@/features/rooms/components/RoomDetailView";

interface RoomPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params: paramsPromise,
}: RoomPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  return {
    title: `Study Room ${params.id} | StudyHub`,
    description:
      "Collaborative study room with Pomodoro timer, notes, and chat",
  };
}

export default async function RoomPage({
  params: paramsPromise,
}: RoomPageProps) {
  const params = await paramsPromise;

  if (!params.id) {
    notFound();
  }

  return <RoomDetailView roomId={params.id} />;
}
