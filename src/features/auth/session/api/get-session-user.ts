import type { SessionUser } from '@/entities/session/model/session-store';
import { apiClient } from '@/shared/api/api-client';

import type { AuthUserResponse } from './types';

async function getSessionUser(): Promise<SessionUser> {
  const response = await apiClient.get('auth/self').json<AuthUserResponse>();

  return {
    id: response.userId,
    email: response.email,
    nickname: response.username ?? response.email,
    profileImageUrl: response.profileImageURL ?? null,
  };
}

export { getSessionUser };
