import { ProfilePage } from '@/screens/profile/ui/profile-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { BottomNavigationDefault } from '@/widgets/app-shell/ui/bottom-navigation-default';

function ProfileRoute() {
  return (
    <AppShell headerSlot={<AppHeaderDefault />} bottomNavigationSlot={<BottomNavigationDefault />}>
      <ProfilePage />
    </AppShell>
  );
}

export { ProfileRoute as default };
