import { HomePage } from '@/screens/home/ui/home-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { BottomNavigationDefault } from '@/widgets/app-shell/ui/bottom-navigation-default';

function HomeRoute() {
  return (
    <AppShell headerSlot={<AppHeaderDefault />} bottomNavigationSlot={<BottomNavigationDefault />}>
      <HomePage />
    </AppShell>
  );
}

export default HomeRoute;
