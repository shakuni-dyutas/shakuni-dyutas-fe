'use client';

import { Home, PlusCircle, UserRound } from 'lucide-react';
import { ROUTE_PATHS } from '@/shared/config/constants';
import type { NavigationItem } from './bottom-navigation';
import { BottomNavigation } from './bottom-navigation';

interface BottomNavigationDefaultProps {
  onCreateRoomClick?: () => void;
}

function BottomNavigationDefault({ onCreateRoomClick }: BottomNavigationDefaultProps) {
  const items: NavigationItem[] = [
    {
      id: 'home',
      label: '로비',
      href: ROUTE_PATHS.HOME,
      icon: Home,
      ariaLabel: '로비로 이동',
    },
    {
      id: 'create',
      label: '방 생성',
      href: '#create-room',
      icon: PlusCircle,
      isPrimary: true,
      ariaLabel: '방 만들기',
      onClick: onCreateRoomClick,
    },
    {
      id: 'profile',
      label: '프로필',
      href: ROUTE_PATHS.PROFILE,
      icon: UserRound,
      ariaLabel: '프로필로 이동',
    },
  ];

  return <BottomNavigation items={items} />;
}

export { BottomNavigationDefault };
export type { BottomNavigationDefaultProps };
