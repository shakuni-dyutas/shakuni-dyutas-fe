'use client';

import { Home, Trophy, UserRound } from 'lucide-react';
import { ROUTE_PATHS } from '@/shared/config/constants';
import type { NavigationItem } from './bottom-navigation';
import { BottomNavigation } from './bottom-navigation';

function BottomNavigationDefault() {
  const items: NavigationItem[] = [
    {
      id: 'home',
      label: '로비',
      href: ROUTE_PATHS.HOME,
      icon: Home,
      ariaLabel: '로비로 이동',
    },
    {
      id: 'profile',
      label: '프로필',
      href: ROUTE_PATHS.PROFILE,
      icon: UserRound,
      ariaLabel: '프로필로 이동',
    },
    {
      id: 'rankings',
      label: '랭킹',
      href: ROUTE_PATHS.RANKINGS,
      icon: Trophy,
      ariaLabel: '랭킹으로 이동',
    },
  ];

  return <BottomNavigation items={items} />;
}

export { BottomNavigationDefault };
