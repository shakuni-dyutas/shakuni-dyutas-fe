export const MOCK_ACCESS_TOKEN = 'mock-access-token';
export const MOCK_REFRESHED_ACCESS_TOKEN = 'mock-access-token-refreshed';
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token';
export const MOCK_REFRESH_TOKEN_ROTATED = 'mock-refresh-token-rotated';
export const MOCK_USER = {
  userId: 'mock-user-id',
  email: 'player@dyutas.app',
  username: 'Dyutas Player',
  profileImageURL: null,
};

export const MOCK_SESSION_USER = {
  id: MOCK_USER.userId,
  email: MOCK_USER.email,
  nickname: MOCK_USER.username ?? 'Dyutas Player',
  profileImageUrl: MOCK_USER.profileImageURL,
};

export const MOCK_USER_ID = MOCK_USER.userId;

export const GOOGLE_AUTH_CODES = {
  EXISTING_USER: 'existing-user-code',
  NEW_USER: 'new-user-code',
  INVALID: 'invalid-code',
  MISSING: 'missing-code',
} as const;

export function createAccessTokenResponse(accessToken: string) {
  const issuedAt = Date.now();

  return {
    accessToken,
    issuedAt,
    expiresIn: 60 * 15,
  };
}
