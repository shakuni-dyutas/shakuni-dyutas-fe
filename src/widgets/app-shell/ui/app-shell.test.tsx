import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { AppHeaderDefault } from './app-header-default';
import { AppShell } from './app-shell';

const backMock = vi.fn();
const pushMock = vi.fn();
const currentPathname = '/';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
    push: pushMock,
  }),
  usePathname: () => currentPathname,
}));

describe('AppShell', () => {
  test('헤더/메인/내비게이션 슬롯과 safe-area 스타일을 렌더링한다', () => {
    render(
      <AppShell
        headerSlot={<AppHeaderDefault />}
        bottomNavigationSlot={<div>Bottom Slot</div>}
        mainClassName="custom-main"
        contentClassName="custom-content"
      >
        <div>Content Area</div>
      </AppShell>,
    );

    const shellElement = screen.getByRole('main').parentElement;
    const headerElement = document.querySelector('[data-slot="app-shell:header"]');
    const bottomNavElement = document.querySelector('[data-slot="app-shell:bottom-nav"]');

    expect(shellElement).not.toBeNull();
    expect(shellElement).toHaveAttribute('data-slot', 'app-shell');
    expect(shellElement).toHaveStyle({
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    });

    expect(headerElement).toBeInTheDocument();
    expect(bottomNavElement).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '주요 내비게이션' })).toBeInTheDocument();
    expect(screen.getByText('Content Area')).toBeInTheDocument();
  });
});
