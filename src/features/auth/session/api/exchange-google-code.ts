import type { SessionSnapshot, SessionUser } from '@/entities/session/model/session-store';
import { apiClient } from '@/shared/api/api-client';

type ExchangeGoogleCodeParams = {
  code: string;
};

type GoogleSignInResponseUser =
  | {
      user_id: string;
      email: string;
      nickname: string;
      profileImageUrl: string | null;
    }
  | {
      id: string;
      email: string;
      name: string;
      avatarUrl?: string | null;
    };

type GoogleSignInResponseDto = {
  accessToken: string;
  user: GoogleSignInResponseUser;
};

function mapUserResponse(user: GoogleSignInResponseUser): SessionUser {
  if ('user_id' in user) {
    return {
      id: user.user_id,
      email: user.email,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl ?? null,
    };
  }

  return {
    id: user.id,
    email: user.email,
    nickname: user.name,
    profileImageUrl: user.avatarUrl ?? null,
  };
}

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
    user: mapUserResponse(response.user),
  };
}

export type { ExchangeGoogleCodeParams };
export { exchangeGoogleAuthorizationCode };
