import { HttpResponse, http } from 'msw';

import {
  createAccessTokenResponse,
  GOOGLE_AUTH_CODES,
  MOCK_ACCESS_TOKEN,
  MOCK_REFRESH_TOKEN,
  MOCK_REFRESH_TOKEN_ROTATED,
  MOCK_REFRESHED_ACCESS_TOKEN,
  MOCK_USER,
} from './constants';

type GoogleSignInRequestBody = {
  code?: string;
  redirectUri?: string;
};
const RTK_COOKIE_NAME = 'rtk';
const RTK_COOKIE_ATTRIBUTES = ['Path=/auth', 'HttpOnly', 'Secure', 'SameSite=None'] as const;

function serializeRefreshCookie(value: string, options?: { maxAge?: number }) {
  const attributes: string[] = [...RTK_COOKIE_ATTRIBUTES];

  if (typeof options?.maxAge === 'number') {
    attributes.push(`Max-Age=${options.maxAge}`);
  }

  return `${RTK_COOKIE_NAME}=${value}; ${attributes.join('; ')}`;
}

function createErrorResponse(status: number, code: string, message: string) {
  return HttpResponse.json(
    {
      errors: [
        {
          code,
          message,
        },
      ],
    },
    { status },
  );
}

let currentRefreshToken: string | null = MOCK_REFRESH_TOKEN;

function resetAuthMockState() {
  currentRefreshToken = MOCK_REFRESH_TOKEN;
}

async function handleGoogleSignIn({ request }: { request: Request }) {
  const body = (await request.json()) as GoogleSignInRequestBody;
  const code = body.code?.trim();

  if (!code || code === GOOGLE_AUTH_CODES.MISSING) {
    return createErrorResponse(400, 'INVALID_CODE', 'Authorization code is invalid');
  }

  if (code === GOOGLE_AUTH_CODES.INVALID) {
    return createErrorResponse(401, 'INVALID_CODE', 'Authorization code is invalid');
  }

  const isNewUser = code === GOOGLE_AUTH_CODES.NEW_USER;
  currentRefreshToken = MOCK_REFRESH_TOKEN;

  return HttpResponse.json(
    {
      ...createAccessTokenResponse(MOCK_ACCESS_TOKEN),
      user: MOCK_USER,
    },
    {
      status: isNewUser ? 201 : 200,
      headers: {
        'Set-Cookie': serializeRefreshCookie(currentRefreshToken),
      },
    },
  );
}

async function handleSessionRefresh() {
  if (!currentRefreshToken) {
    return createErrorResponse(401, 'INVALID_CODE', 'Authorization code is invalid');
  }

  currentRefreshToken = MOCK_REFRESH_TOKEN_ROTATED;

  return HttpResponse.json(
    {
      ...createAccessTokenResponse(MOCK_REFRESHED_ACCESS_TOKEN),
    },
    {
      status: 201,
      headers: {
        'Set-Cookie': serializeRefreshCookie(currentRefreshToken),
      },
    },
  );
}

async function handleSessionSignOut() {
  // 실제 구현은 멱등적으로 204를 반환하고 쿠키를 제거한다.
  currentRefreshToken = null;

  return new HttpResponse(null, {
    status: 204,
    headers: {
      'Set-Cookie': serializeRefreshCookie('', { maxAge: 0 }),
    },
  });
}

const authHandlers = [
  http.post('*/auth/signin/google', handleGoogleSignIn),
  http.post('*/auth/refresh', handleSessionRefresh),
  http.post('*/auth/signout', handleSessionSignOut),
];

export { authHandlers, resetAuthMockState };
