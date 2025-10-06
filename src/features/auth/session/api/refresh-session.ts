import { apiClient } from '@/shared/api/api-client';

type RefreshSessionResponse = {
  accessToken: string;
};

async function requestSessionRefresh(): Promise<RefreshSessionResponse> {
  const response = await apiClient
    .post('auth/refresh', {
      json: {},
    })
    .json<RefreshSessionResponse>();

  return response;
}

export type { RefreshSessionResponse };
export { requestSessionRefresh };
