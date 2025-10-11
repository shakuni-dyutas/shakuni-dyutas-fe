import { notFound } from 'next/navigation';

import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';

interface RoomDetailRouteProps {
  params: {
    roomId?: string;
  };
}

function RoomDetailRoute({ params }: RoomDetailRouteProps) {
  const encodedRoomId = params.roomId;

  if (!encodedRoomId) {
    notFound();
  }

  const roomId = decodeURIComponent(encodedRoomId);

  return (
    <AppShell headerSlot={<AppHeaderDefault title="방 상세" />}>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10">
        <h1 className="font-semibold text-2xl">방 정보를 준비 중이에요.</h1>
        <p className="text-muted-foreground text-sm">
          실제 방 상세화면은 곧 제공될 예정입니다. 현재는 `{roomId}` 방으로 이동한 상태이며, 필요한
          데이터 연동이 완료되면 이 영역에서 진행 현황과 참여 정보를 확인할 수 있어요.
        </p>
      </section>
    </AppShell>
  );
}

export { RoomDetailRoute as default };
