import { beforeEach, describe, expect, test } from 'vitest';

import { useSessionStore } from '@/entities/session/model/session-store';
import {
  GOOGLE_AUTH_CODES,
  MOCK_ACCESS_TOKEN,
  MOCK_REFRESHED_ACCESS_TOKEN,
  MOCK_USER,
  MOCK_USER_ID,
} from '@/shared/mocks/handlers/constants';

import { completeGoogleLogin, refreshSession } from './session-service';

describe('session-service', () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
  });

  test('completeGoogleLogin 성공 시 세션 정보를 저장한다', async () => {
    const snapshot = await completeGoogleLogin({ code: GOOGLE_AUTH_CODES.VALID });

    const state = useSessionStore.getState();

    expect(snapshot.accessToken).toBe(MOCK_ACCESS_TOKEN);
    expect(state.accessToken).toBe(MOCK_ACCESS_TOKEN);
    expect(state.user?.id).toBe(MOCK_USER_ID);
    expect(state.isAuthenticated).toBe(true);
  });

  test('completeGoogleLogin 실패 시 오류를 전달하고 세션을 변경하지 않는다', async () => {
    await expect(completeGoogleLogin({ code: GOOGLE_AUTH_CODES.INVALID })).rejects.toThrowError();

    const state = useSessionStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('refreshSession 액세스 토큰을 갱신한다', async () => {
    useSessionStore.getState().setSession({
      accessToken: 'stale-token',
      user: { ...MOCK_USER },
    });

    const result = await refreshSession();

    const state = useSessionStore.getState();

    expect(result.accessToken).toBe(MOCK_REFRESHED_ACCESS_TOKEN);
    expect(state.accessToken).toBe(MOCK_REFRESHED_ACCESS_TOKEN);
    expect(state.isAuthenticated).toBe(true);
  });
});
