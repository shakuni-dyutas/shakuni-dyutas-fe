import { LobbyPage } from '@/screens/lobby/ui/lobby-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { BottomNavigationDefault } from '@/widgets/app-shell/ui/bottom-navigation-default';

function HomeRoute() {
  return (
    <AppShell headerSlot={<AppHeaderDefault />} bottomNavigationSlot={<BottomNavigationDefault />}>
      <LobbyPage />
    </AppShell>
  );
}

export default HomeRoute;
