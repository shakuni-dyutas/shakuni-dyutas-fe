import type { SessionSnapshot } from '@/entities/session/model/session-store';
import { apiClient } from '@/shared/api/api-client';

type ExchangeGoogleCodeParams = {
  code: string;
  redirectUri?: string;
};

type ExchangeGoogleCodeResponse = SessionSnapshot;

async function exchangeGoogleAuthorizationCode({
  code,
  redirectUri,
}: ExchangeGoogleCodeParams): Promise<ExchangeGoogleCodeResponse> {
  const response = await apiClient
    .post('auth/google', {
      json: {
        code,
        ...(redirectUri ? { redirectUri } : {}),
      },
    })
    .json<ExchangeGoogleCodeResponse>();

  return response;
}

export type { ExchangeGoogleCodeParams, ExchangeGoogleCodeResponse };
export { exchangeGoogleAuthorizationCode };
