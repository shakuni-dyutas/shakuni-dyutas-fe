import { useSessionStore } from '@/entities/session/model/session-store';
import { exchangeGoogleAuthorizationCode } from '@/features/auth/session/api/exchange-google-code';
import { requestSessionRefresh } from '@/features/auth/session/api/refresh-session';
import { requestSessionSignOut } from '@/features/auth/session/api/signout-session';
import { configureApiClientAuthentication } from '@/shared/api/api-client';
import { logDebug } from '@/shared/lib/logger';

interface CompleteGoogleLoginParams {
  code: string;
  redirectUri?: string;
}

configureApiClientAuthentication({
  getAccessToken: () => useSessionStore.getState().accessToken,
  refreshAccessToken: async () => {
    try {
      useSessionStore.getState().setBootstrapping(true);
      const { accessToken } = await requestSessionRefresh();
      useSessionStore.getState().setAccessToken(accessToken);
      return true;
    } catch (error) {
      useSessionStore.getState().clearSession();
      logDebug('Session', '액세스 토큰 갱신에 실패했어요.', error);
      return false;
    } finally {
      useSessionStore.getState().setBootstrapping(false);
    }
  },
  clearSession: () => {
    useSessionStore.getState().clearSession();
  },
});

async function completeGoogleLogin(params: CompleteGoogleLoginParams) {
  const { code } = params;

  const sessionSnapshot = await exchangeGoogleAuthorizationCode({
    code,
  });

  useSessionStore.getState().setSession(sessionSnapshot);

  return sessionSnapshot;
}

async function refreshSession() {
  const { accessToken } = await requestSessionRefresh();

  useSessionStore.getState().setAccessToken(accessToken);

  return { accessToken };
}

async function signOut() {
  try {
    await requestSessionSignOut();
  } catch (error) {
    logDebug('Session', '로그아웃 요청 중 오류가 발생했어요.', error);
  } finally {
    useSessionStore.getState().clearSession();
  }
}

function clearSession() {
  useSessionStore.getState().clearSession();
}

let refreshBootstrapPromise: Promise<void> | null = null;

async function ensureSessionWithRefreshToken() {
  if (typeof window === 'undefined') {
    return;
  }

  if (refreshBootstrapPromise) {
    await refreshBootstrapPromise;
    return;
  }

  refreshBootstrapPromise = (async () => {
    try {
      useSessionStore.getState().setBootstrapping(true);
      const { accessToken } = await requestSessionRefresh();
      useSessionStore.getState().setAccessToken(accessToken);
    } catch (error) {
      logDebug('Session', 'Refresh Token으로 액세스 토큰을 갱신하는데 실패했어요.', error);
      useSessionStore.getState().clearSession();
    } finally {
      useSessionStore.getState().setBootstrapping(false);
    }
  })();

  try {
    await refreshBootstrapPromise;
  } finally {
    refreshBootstrapPromise = null;
  }
}

export {
  clearSession,
  completeGoogleLogin,
  ensureSessionWithRefreshToken,
  refreshSession,
  signOut,
};
