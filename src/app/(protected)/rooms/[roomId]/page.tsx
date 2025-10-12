import { notFound } from 'next/navigation';

import { RoomDetailPage } from '@/screens/rooms/detail/ui/room-detail-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';

interface RoomDetailRouteProps {
  params: Promise<{
    roomId?: string;
  }>;
}

async function RoomDetailRoute({ params }: RoomDetailRouteProps) {
  const { roomId } = await params;

  if (!roomId) {
    notFound();
  }

  return (
    <AppShell headerSlot={<AppHeaderDefault title="방 상세" />}>
      <RoomDetailPage roomId={roomId} />
    </AppShell>
  );
}

export { RoomDetailRoute as default };
