import { apiClient } from '@/shared/api/api-client';

async function requestSessionSignOut(): Promise<void> {
  await apiClient.post('auth/signout', {
    json: {},
  });
}

export { requestSessionSignOut };
