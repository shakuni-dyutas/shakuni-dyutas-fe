import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';

import type { SessionUser } from '@/entities/session/model/session-store';

import { useSessionStore } from '@/entities/session/model/session-store';
import { MOCK_SESSION_USER } from '@/shared/mocks/handlers/constants';

import { ProfileStats } from './profile-stats';

describe('ProfileStats', () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
  });

  test('포인트와 랭크를 천 단위 포맷으로 표시한다', () => {
    useSessionStore.setState({
      user: MOCK_SESSION_USER,
      accessToken: 'token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    render(<ProfileStats />);

    expect(screen.getByText('12,345 pt')).toBeInTheDocument();
    expect(screen.getByText('Rank #12')).toBeInTheDocument();
  });

  test('세션 사용자 값에 따라 포인트/랭크가 바뀐다', () => {
    const user: SessionUser = {
      ...MOCK_SESSION_USER,
      points: 987654,
      rank: 2,
    };

    useSessionStore.setState({
      user,
      accessToken: 'token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    render(<ProfileStats />);

    expect(screen.getByText('987,654 pt')).toBeInTheDocument();
    expect(screen.getByText('Rank #2')).toBeInTheDocument();
  });
});
