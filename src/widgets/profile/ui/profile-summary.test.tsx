import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';

import type { SessionUser } from '@/entities/session/model/session-store';

import { useSessionStore } from '@/entities/session/model/session-store';
import { MOCK_SESSION_USER } from '@/shared/mocks/handlers/constants';

import { ProfileSummary } from './profile-summary';

describe('ProfileSummary', () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
  });

  test('참여/승리/패배 값을 표시한다', () => {
    useSessionStore.setState({
      user: MOCK_SESSION_USER,
      accessToken: 'token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    render(<ProfileSummary />);

    expect(screen.getByText('참여')).toBeInTheDocument();
    expect(screen.getByText(String(MOCK_SESSION_USER.debates))).toBeInTheDocument();
    expect(screen.getByText('승리')).toBeInTheDocument();
    expect(screen.getByText(String(MOCK_SESSION_USER.wins))).toBeInTheDocument();
    expect(screen.getByText('패배')).toBeInTheDocument();
    expect(screen.getByText(String(MOCK_SESSION_USER.loses))).toBeInTheDocument();
  });

  test('사용자 값이 바뀌면 요약도 갱신된다', () => {
    const user: SessionUser = {
      ...MOCK_SESSION_USER,
      debates: 5,
      wins: 3,
      loses: 2,
    };

    useSessionStore.setState({
      user,
      accessToken: 'token',
      isAuthenticated: true,
      isBootstrapping: false,
    });
    render(<ProfileSummary />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
