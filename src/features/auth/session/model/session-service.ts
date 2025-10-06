import { useSessionStore } from '@/entities/session/model/session-store';
import { exchangeGoogleAuthorizationCode } from '@/features/auth/session/api/exchange-google-code';
import { requestSessionRefresh } from '@/features/auth/session/api/refresh-session';
import { configureApiClientAuthentication } from '@/shared/api/api-client';

interface CompleteGoogleLoginParams {
  code: string;
  redirectUri?: string;
}

configureApiClientAuthentication({
  getAccessToken: () => useSessionStore.getState().accessToken,
  refreshAccessToken: async () => {
    try {
      const { accessToken } = await requestSessionRefresh();
      useSessionStore.getState().setAccessToken(accessToken);
      return true;
    } catch (error) {
      useSessionStore.getState().clearSession();
      console.error('[Session] 액세스 토큰 갱신에 실패했어요.', error);
      return false;
    }
  },
  clearSession: () => {
    useSessionStore.getState().clearSession();
  },
});

async function completeGoogleLogin({ code, redirectUri }: CompleteGoogleLoginParams) {
  const sanitizedRedirectUri =
    typeof redirectUri === 'string' && redirectUri.startsWith('/') && !redirectUri.startsWith('//')
      ? redirectUri
      : undefined;

  const sessionSnapshot = await exchangeGoogleAuthorizationCode({
    code,
    redirectUri: sanitizedRedirectUri,
  });

  useSessionStore.getState().setSession(sessionSnapshot);

  return sessionSnapshot;
}

async function refreshSession() {
  const { accessToken } = await requestSessionRefresh();

  useSessionStore.getState().setAccessToken(accessToken);

  return { accessToken };
}

function clearSession() {
  useSessionStore.getState().clearSession();
}

export { clearSession, completeGoogleLogin, refreshSession };
