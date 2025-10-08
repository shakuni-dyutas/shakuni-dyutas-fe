import { HttpResponse, http } from 'msw';

const MOCK_ACCESS_TOKEN = 'mock-access-token';
const MOCK_REFRESHED_ACCESS_TOKEN = 'mock-access-token-refreshed';
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'player@dyutas.app',
  name: 'Dyutas Player',
  avatarUrl: null,
};

function createAccessTokenResponse(accessToken: string) {
  const issuedAt = Date.now();

  return {
    accessToken,
    issuedAt,
    expiresIn: 60 * 15,
  };
}

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
  http.post('*/auth/google', async ({ request }) => {
    const body = (await request.json()) as { code?: string; redirectUri?: string };
    const { code, redirectUri } = body;

    if (!code) {
      return HttpResponse.json({ message: 'Authorization code가 필요해요.' }, { status: 400 });
    }

    if (code === 'invalid-code') {
      return HttpResponse.json({ message: '유효하지 않은 코드예요.' }, { status: 400 });
    }

    if (code === 'cancelled') {
      return HttpResponse.json(
        { message: '로그인이 취소되었어요. 다시 진행해주세요.' },
        { status: 499 },
      );
    }

    if (code === 'server-error') {
      return HttpResponse.json(
        { message: '서버에서 오류가 발생했어요. 잠시 후 다시 시도해주세요.' },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      ...createAccessTokenResponse(MOCK_ACCESS_TOKEN),
      redirectUri,
      user: MOCK_USER,
    });
  }),
  http.post('*/auth/refresh', () =>
    HttpResponse.json({
      ...createAccessTokenResponse(MOCK_REFRESHED_ACCESS_TOKEN),
    }),
  ),
];
