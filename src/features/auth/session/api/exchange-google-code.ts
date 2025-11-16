import type { SessionSnapshot, SessionUser } from '@/entities/session/model/session-store';
import { apiClient } from '@/shared/api/api-client';

import type { AuthUserResponse } from './types';

type ExchangeGoogleCodeParams = {
  code: string;
};

type GoogleSignInResponseDto = {
  accessToken: string;
  user: AuthUserResponse;
};

async function exchangeGoogleAuthorizationCode({
  code,
}: ExchangeGoogleCodeParams): Promise<SessionSnapshot> {
  const response = await apiClient
    .post('auth/signin/google', {
      json: {
        code,
      },
    })
    .json<GoogleSignInResponseDto>();

  return {
    accessToken: response.accessToken,
    user: {
      id: response.user.userId,
      email: response.user.email,
      nickname: response.user.username ?? response.user.email,
      profileImageUrl: response.user.profileImageURL ?? null,
      points: response.user.points ?? 0,
      rank: response.user.rank ?? 0,
      debates: response.user.debates ?? 0,
      wins: response.user.wins ?? 0,
      loses: response.user.loses ?? 0,
    },
  };
}

export type { ExchangeGoogleCodeParams };
export { exchangeGoogleAuthorizationCode };
