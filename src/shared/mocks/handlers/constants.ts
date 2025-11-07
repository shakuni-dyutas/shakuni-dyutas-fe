export const MOCK_ACCESS_TOKEN = 'mock-access-token';
export const MOCK_REFRESHED_ACCESS_TOKEN = 'mock-access-token-refreshed';
export const MOCK_USER = {
  id: 'mock-user-id',
  user_id: 'mock-user-id',
  email: 'player@dyutas.app',
  name: 'Dyutas Player',
  nickname: 'Dyutas Player',
  avatarUrl: null,
  profileImageUrl: null,
};
export const MOCK_USER_ID = MOCK_USER.id;

export const GOOGLE_AUTH_CODES = {
  VALID: 'valid-code',
  INVALID: 'invalid-code',
  CANCELLED: 'cancelled',
  SERVER_ERROR: 'server-error',
} as const;

export function createAccessTokenResponse(accessToken: string) {
  const issuedAt = Date.now();

  return {
    accessToken,
    issuedAt,
    expiresIn: 60 * 15,
  };
}
