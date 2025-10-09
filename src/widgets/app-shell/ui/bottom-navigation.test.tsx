import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home, PlusCircle, UserRound } from 'lucide-react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { NavigationItem } from './bottom-navigation';
import { BottomNavigation } from './bottom-navigation';

vi.mock('next/navigation', () => ({
  usePathname: () => '/profile',
}));

describe('BottomNavigation', () => {
  test('활성 상태인 항목에 data-active가 true로 설정된다', () => {
    const items: NavigationItem[] = [
      { id: 'home', label: '홈', href: '/', icon: Home },
      { id: 'profile', label: '프로필', href: '/profile', icon: UserRound },
    ];

    render(<BottomNavigation items={items} />);

    const activeLink = screen.getByRole('link', { name: '프로필' });
    const inactiveLink = screen.getByRole('link', { name: '홈' });

    expect(activeLink).toHaveAttribute('data-active', 'true');
    expect(inactiveLink).toHaveAttribute('data-active', 'false');
  });

  test('onClick이 있는 항목은 버튼으로 렌더링된다', async () => {
    const items: NavigationItem[] = [
      {
        id: 'create',
        label: '방 생성',
        href: '#create',
        icon: PlusCircle,
        onClick: vi.fn(),
      },
    ];

    render(<BottomNavigation items={items} />);

    const button = screen.getByRole('button', { name: '방 생성' });
    expect(button.tagName).toBe('BUTTON');
  });
});

vi.mock('@/shared/config/constants', () => ({
  ROUTE_PATHS: {
    HOME: '/',
    PROFILE: '/profile',
  },
}));

describe('BottomNavigationDefault', () => {
  const onCreateRoomClick = vi.fn();

  beforeEach(() => {
    onCreateRoomClick.mockReset();
  });

  test('기본 네비게이션 항목을 렌더링하고 라우터 이동을 호출한다', async () => {
    const user = userEvent.setup();

    const { BottomNavigationDefault } = await import('./bottom-navigation-default');

    render(<BottomNavigationDefault onCreateRoomClick={onCreateRoomClick} />);

    const homeLink = screen.getByRole('link', { name: '로비로 이동' });
    const profileLink = screen.getByRole('link', { name: '프로필로 이동' });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(profileLink).toHaveAttribute('href', '/profile');

    await user.click(screen.getByRole('button', { name: '방 만들기' }));

    expect(onCreateRoomClick).toHaveBeenCalledTimes(1);
  });
});
