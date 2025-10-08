export const MOCK_ACCESS_TOKEN = 'mock-access-token';
export const MOCK_REFRESHED_ACCESS_TOKEN = 'mock-access-token-refreshed';
export const MOCK_USER = {
  id: 'mock-user-id',
  email: 'player@dyutas.app',
  name: 'Dyutas Player',
  avatarUrl: null,
};

export function createAccessTokenResponse(accessToken: string) {
  const issuedAt = Date.now();

  return {
    accessToken,
    issuedAt,
    expiresIn: 60 * 15,
  };
}
