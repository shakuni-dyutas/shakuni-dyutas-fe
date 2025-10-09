import { HttpResponse, http } from 'msw';

import {
  createAccessTokenResponse,
  GOOGLE_AUTH_CODES,
  MOCK_ACCESS_TOKEN,
  MOCK_REFRESHED_ACCESS_TOKEN,
  MOCK_USER,
} from './constants';

export const authHandlers = [
  http.post('*/auth/google', async ({ request }) => {
    const body = (await request.json()) as { code?: string; redirectUri?: string };
    const { code, redirectUri } = body;

    if (!code) {
      return HttpResponse.json({ message: 'Authorization code가 필요해요.' }, { status: 400 });
    }

    if (code === GOOGLE_AUTH_CODES.INVALID) {
      return HttpResponse.json({ message: '유효하지 않은 코드예요.' }, { status: 400 });
    }

    if (code === GOOGLE_AUTH_CODES.CANCELLED) {
      return HttpResponse.json(
        { message: '로그인이 취소되었어요. 다시 진행해주세요.' },
        { status: 499 },
      );
    }

    if (code === GOOGLE_AUTH_CODES.SERVER_ERROR) {
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
