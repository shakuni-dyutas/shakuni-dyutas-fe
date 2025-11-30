import { notFound } from 'next/navigation';

import { RoomResultRoute } from '@/screens/rooms/result/ui';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';

interface RoomResultRoutePageProps {
  params: Promise<{
    roomId?: string;
  }>;
}

async function RoomResultRoutePage({ params }: RoomResultRoutePageProps) {
  const { roomId } = await params;

  if (!roomId) {
    notFound();
  }

  return (
    <AppShell headerSlot={<AppHeaderDefault title="토론 결과" />}>
      <RoomResultRoute roomId={roomId} />
    </AppShell>
  );
}

export { RoomResultRoutePage as default };
