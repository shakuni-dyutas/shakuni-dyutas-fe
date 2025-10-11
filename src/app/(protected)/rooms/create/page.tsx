import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { CreateRoomPanel } from '@/widgets/rooms/create/ui/create-room-panel';

function CreateRoomRoute() {
  return (
    <AppShell headerSlot={<AppHeaderDefault title="방 생성" />}>
      <CreateRoomPanel />
    </AppShell>
  );
}

export { CreateRoomRoute as default };
