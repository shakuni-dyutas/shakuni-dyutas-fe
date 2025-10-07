import { beforeEach, describe, expect, test } from 'vitest';

import { useSessionStore } from '@/entities/session/model/session-store';

import { completeGoogleLogin, refreshSession } from './session-service';

describe('session-service', () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
  });

  test('completeGoogleLogin 성공 시 세션 정보를 저장한다', async () => {
    const snapshot = await completeGoogleLogin({ code: 'valid-code' });

    const state = useSessionStore.getState();

    expect(snapshot.accessToken).toBe('mock-access-token');
    expect(state.accessToken).toBe('mock-access-token');
    expect(state.user?.id).toBe('mock-user-id');
    expect(state.isAuthenticated).toBe(true);
  });

  test('completeGoogleLogin 실패 시 오류를 전달하고 세션을 변경하지 않는다', async () => {
    await expect(completeGoogleLogin({ code: 'invalid-code' })).rejects.toThrowError();

    const state = useSessionStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('refreshSession 액세스 토큰을 갱신한다', async () => {
    useSessionStore.getState().setSession({
      accessToken: 'stale-token',
      user: {
        id: 'mock-user-id',
        email: 'player@dyutas.app',
        name: 'Dyutas Player',
        avatarUrl: null,
      },
    });

    const result = await refreshSession();

    const state = useSessionStore.getState();

    expect(result.accessToken).toBe('mock-access-token-refreshed');
    expect(state.accessToken).toBe('mock-access-token-refreshed');
    expect(state.isAuthenticated).toBe(true);
  });
});
