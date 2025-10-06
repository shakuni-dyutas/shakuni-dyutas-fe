import type { Hooks, Options } from 'ky';

import { httpClient } from '@/shared/api/http-client';

type AccessTokenProvider = () => string | null;
type RefreshTokenHandler = () => Promise<boolean>;
type ClearSessionHandler = () => void;

interface AuthenticationHandlers {
  getAccessToken: AccessTokenProvider | null;
  refreshAccessToken: RefreshTokenHandler | null;
  clearSession: ClearSessionHandler | null;
}

interface ConfigureApiClientAuthenticationOptions {
  getAccessToken: AccessTokenProvider;
  refreshAccessToken?: RefreshTokenHandler;
  clearSession?: ClearSessionHandler;
}

const REFRESH_ATTEMPT_HEADER = 'x-refresh-attempted';
const AUTH_REFRESH_ENDPOINT_SEGMENT = '/auth/refresh';

const authenticationHandlers: AuthenticationHandlers = {
  getAccessToken: null,
  refreshAccessToken: null,
  clearSession: null,
};

function configureApiClientAuthentication({
  getAccessToken,
  refreshAccessToken,
  clearSession,
}: ConfigureApiClientAuthenticationOptions) {
  authenticationHandlers.getAccessToken = getAccessToken;
  authenticationHandlers.refreshAccessToken = refreshAccessToken ?? null;
  authenticationHandlers.clearSession = clearSession ?? null;
}

const apiClient = httpClient.extend({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        if (!authenticationHandlers.getAccessToken) {
          return;
        }

        const accessToken = authenticationHandlers.getAccessToken();

        if (!accessToken) {
          return;
        }

        request.headers.set('Authorization', `Bearer ${accessToken}`);
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) {
          return;
        }

        const hasRefreshedAlready =
          request.headers.get(REFRESH_ATTEMPT_HEADER) === 'true' ||
          (options.headers instanceof Headers
            ? options.headers.get(REFRESH_ATTEMPT_HEADER) === 'true'
            : (options.headers as Record<string, string> | undefined)?.[REFRESH_ATTEMPT_HEADER] ===
              'true');

        if (
          hasRefreshedAlready ||
          request.url.includes(AUTH_REFRESH_ENDPOINT_SEGMENT) ||
          !authenticationHandlers.refreshAccessToken
        ) {
          authenticationHandlers.clearSession?.();
          return;
        }

        try {
          const refreshSucceeded = await authenticationHandlers.refreshAccessToken();

          if (!refreshSucceeded) {
            authenticationHandlers.clearSession?.();
            return;
          }
        } catch (error) {
          authenticationHandlers.clearSession?.();
          throw error;
        }

        const retryHeaders = new Headers(request.headers);
        retryHeaders.set(REFRESH_ATTEMPT_HEADER, 'true');

        const retryRequest = new Request(request, { headers: retryHeaders });

        const mergedOptions: Options = {
          ...options,
          headers: retryHeaders,
        };

        const retryResponse = await apiClient(retryRequest, mergedOptions);

        return retryResponse;
      },
    ],
  } satisfies Hooks,
});

export { apiClient, configureApiClientAuthentication };
