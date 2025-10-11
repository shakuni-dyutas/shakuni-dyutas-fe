import type { HTTPError } from 'ky';

import { logDebug } from '@/shared/lib/logger';

async function resolveCreateRoomErrorMessage(error: HTTPError) {
  try {
    const body = await error.response.clone().json();

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: string }).message;
      return typeof message === 'string' ? message : null;
    }
  } catch (parseError) {
    logDebug('CreateRoom', '방 생성 오류 응답 파싱에 실패했어요.', parseError);
  }

  return null;
}

export { resolveCreateRoomErrorMessage };
