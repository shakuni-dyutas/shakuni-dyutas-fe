import type { Metadata } from 'next';

import { RankingsPage, rankingsMetadata } from '@/screens/rankings/ui/rankings-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { BottomNavigationDefault } from '@/widgets/app-shell/ui/bottom-navigation-default';

export const metadata: Metadata = rankingsMetadata;

function RankingsRoute() {
  return (
    <AppShell
      headerSlot={<AppHeaderDefault title="랭킹" />}
      bottomNavigationSlot={<BottomNavigationDefault />}
    >
      <RankingsPage />
    </AppShell>
  );
}

export { RankingsRoute as default };
