import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { useSessionStore } from '@/entities/session/model/session-store';
import { ROUTE_PATHS } from '@/shared/config/constants';
import { AuthGuard } from './auth-guard';

const replaceMock = vi.fn();
let currentPathname: string | null = ROUTE_PATHS.HOME;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => currentPathname,
}));

function resetSessionState() {
  useSessionStore.setState({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  });
}

describe('AuthGuard', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    currentPathname = ROUTE_PATHS.HOME;
    resetSessionState();
  });

  test('인증된 사용자는 자식 컴포넌트를 볼 수 있다', () => {
    useSessionStore.setState({
      accessToken: 'token',
      isAuthenticated: true,
      user: {
        id: 'session-user',
        email: 'user@example.com',
        name: '세션 유저',
        avatarUrl: null,
      },
    });

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>,
    );

    expect(screen.getByText('protected')).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('인증되지 않은 사용자는 로그인 페이지로 리디렉션된다', async () => {
    currentPathname = '/profile';

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(`${ROUTE_PATHS.LOGIN}?redirect=%2Fprofile`);
    });

    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  test('잘못된 경로는 홈 경로로 리디렉션한다', async () => {
    currentPathname = 'javascript:void(0)';

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(`${ROUTE_PATHS.LOGIN}?redirect=%2F`);
    });
  });
});
