import { RoomShell } from '@/widgets/room-shell/ui/room-shell';

interface RoomDetailPageProps {
  roomId: string;
}

function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  return <RoomShell roomId={roomId} />;
}

export { RoomDetailPage };
export type { RoomDetailPageProps };
