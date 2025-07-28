"use client";

import { RoomLayout } from "./RoomLayout";

interface RoomDetailViewProps {
  roomId: string;
}

export function RoomDetailView({ roomId }: RoomDetailViewProps) {
  return <RoomLayout roomId={roomId} />;
}
