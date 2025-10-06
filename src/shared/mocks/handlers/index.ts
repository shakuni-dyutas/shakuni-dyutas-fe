import { HttpResponse, http } from 'msw';

const MOCK_ACCESS_TOKEN = 'mock-access-token';
const MOCK_REFRESHED_ACCESS_TOKEN = 'mock-access-token-refreshed';
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'player@dyutas.app',
  name: 'Dyutas Player',
  avatarUrl: null,
};

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
  http.post('*/auth/google', async ({ request }) => {
    const { code } = (await request.json()) as { code?: string };

    if (!code || code === 'invalid-code') {
      return HttpResponse.json({ message: '유효하지 않은 코드예요.' }, { status: 400 });
    }

    return HttpResponse.json({
      accessToken: MOCK_ACCESS_TOKEN,
      user: MOCK_USER,
    });
  }),
  http.post('*/auth/refresh', () =>
    HttpResponse.json({
      accessToken: MOCK_REFRESHED_ACCESS_TOKEN,
    }),
  ),
];
