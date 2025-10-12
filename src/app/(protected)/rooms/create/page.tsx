import { CreateRoomPage } from '@/screens/rooms/create/ui/create-room-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';

function CreateRoomRoute() {
  return (
    <AppShell headerSlot={<AppHeaderDefault title="방 생성" />}>
      <CreateRoomPage />
    </AppShell>
  );
}

export { CreateRoomRoute as default };
