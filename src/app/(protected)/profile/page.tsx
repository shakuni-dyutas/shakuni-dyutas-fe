import type { Metadata } from 'next';

import { ProfilePage } from '@/screens/profile/ui/profile-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { BottomNavigationDefault } from '@/widgets/app-shell/ui/bottom-navigation-default';

const metadataTitle = '프로필';

export const metadata: Metadata = {
  title: metadataTitle,
};

function ProfileRoute() {
  return (
    <AppShell
      headerSlot={<AppHeaderDefault title={metadataTitle} />}
      bottomNavigationSlot={<BottomNavigationDefault />}
    >
      <ProfilePage />
    </AppShell>
  );
}

export { ProfileRoute as default };
