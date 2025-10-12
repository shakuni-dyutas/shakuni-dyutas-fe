import type { HTTPError } from 'ky';

import { logDebug } from '@/shared/lib/logger';

interface ResolveHttpErrorMessageOptions {
  namespace?: string;
  parseErrorLogMessage?: string;
}

async function resolveHttpErrorMessage(
  error: HTTPError,
  options: ResolveHttpErrorMessageOptions = {},
) {
  try {
    const body = await error.response.clone().json();

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: string }).message;
      return typeof message === 'string' ? message : null;
    }
  } catch (parseError) {
    const { namespace, parseErrorLogMessage } = options;
    const logNamespace = namespace ?? 'HttpError';
    const logMessage = parseErrorLogMessage ?? 'HTTP 응답 파싱에 실패했어요.';

    logDebug(logNamespace, logMessage, parseError);
  }

  return null;
}

export { resolveHttpErrorMessage };
export type { ResolveHttpErrorMessageOptions };
