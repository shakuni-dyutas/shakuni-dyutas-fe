import type { Metadata } from 'next';

import { RankingsPage } from '@/screens/rankings/ui/rankings-page';
import { AppHeaderDefault } from '@/widgets/app-shell/ui/app-header-default';
import { AppShell } from '@/widgets/app-shell/ui/app-shell';
import { BottomNavigationDefault } from '@/widgets/app-shell/ui/bottom-navigation-default';

export const metadata: Metadata = {
  title: '랭킹',
  description: '글로벌 랭킹과 상위 사용자 포디움을 확인하세요.',
};

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
