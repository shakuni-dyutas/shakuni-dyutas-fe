import type { SessionUser } from '@/entities/session/model/session-store';
import { apiClient } from '@/shared/api/api-client';

interface GetSessionUserResponse {
  user: SessionUser;
}

async function getSessionUser(): Promise<SessionUser> {
  const response = await apiClient.get('auth/me').json<GetSessionUserResponse>();
  return response.user;
}

export type { GetSessionUserResponse };
export { getSessionUser };
