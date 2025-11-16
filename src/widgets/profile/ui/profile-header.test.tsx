import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useSessionStore } from '@/entities/session/model/session-store';
import { signOut } from '@/features/auth/session/model/session-service';
import { MOCK_SESSION_USER } from '@/shared/mocks/handlers/constants';

import { ProfileHeader } from './profile-header';

vi.mock('@/features/auth/session/model/session-service', () => ({
  signOut: vi.fn(),
}));

describe('ProfileHeader', () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    vi.clearAllMocks();
  });

  test('세션 사용자의 닉네임과 이메일을 표시한다', () => {
    useSessionStore.setState({
      user: MOCK_SESSION_USER,
      accessToken: 'token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    render(<ProfileHeader />);

    expect(screen.getByText('Dyutas Player')).toBeInTheDocument();
    expect(screen.getByText('player@dyutas.app')).toBeInTheDocument();
  });

  test('로그아웃 버튼을 클릭하면 signOut이 호출된다', async () => {
    const user = userEvent.setup();
    useSessionStore.setState({
      user: MOCK_SESSION_USER,
      accessToken: 'token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    render(<ProfileHeader />);

    await user.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
