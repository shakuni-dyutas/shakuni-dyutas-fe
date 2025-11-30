import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home, PlusCircle, UserRound } from 'lucide-react';
import { describe, expect, test, vi } from 'vitest';

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

  test('onClick이 있는 항목은 콜백을 호출한다', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const items: NavigationItem[] = [
      {
        id: 'create',
        label: '방 생성',
        onClick: handler,
      },
    ];

    render(<BottomNavigation items={items} />);

    await user.click(screen.getByRole('button', { name: '방 생성' }));

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

vi.mock('@/shared/config/constants', () => ({
  ROUTE_PATHS: {
    HOME: '/',
    PROFILE: '/profile',
    RANKINGS: '/rankings',
  },
}));

describe('BottomNavigationDefault', () => {
  test('로비, 프로필, 랭킹 네비게이션이 렌더링된다', async () => {
    const { BottomNavigationDefault } = await import('./bottom-navigation-default');

    render(<BottomNavigationDefault />);

    const homeLink = screen.getByRole('link', { name: '로비로 이동' });
    const profileLink = screen.getByRole('link', { name: '프로필로 이동' });
    const rankingsLink = screen.getByRole('link', { name: '랭킹으로 이동' });

    expect(homeLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
    expect(rankingsLink).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /방 생성/ })).not.toBeInTheDocument();
  });
});
