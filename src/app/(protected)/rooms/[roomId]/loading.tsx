import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { RoomShellSkeleton } from '@/widgets/room-shell/ui/room-shell-skeleton';

function RoomDetailLoading() {
  return (
    <AppShell headerSlot={<AppHeaderDefault title="방 상세" />}>
      <RoomShellSkeleton />
    </AppShell>
  );
}

export default RoomDetailLoading;
