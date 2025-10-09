import type { HTTPError } from 'ky';

import { logDebug } from '@/shared/lib/logger';

async function resolveHttpErrorMessage(error: HTTPError) {
  try {
    const body = await error.response.clone().json();

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: string }).message;
      return typeof message === 'string' ? message : null;
    }
  } catch (error) {
    logDebug('GoogleOAuth', '로그인 응답 파싱에 실패했어요.', error);
  }

  return null;
}

export { resolveHttpErrorMessage };
