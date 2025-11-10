import type { HTTPError } from 'ky';

import { logDebug } from '@/shared/lib/logger';

interface ResolveHttpErrorMessageOptions {
  namespace?: string;
  parseErrorLogMessage?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractMessageFromErrorsField(errors: unknown): string | null {
  if (!Array.isArray(errors)) {
    return null;
  }

  for (const entry of errors) {
    if (isRecord(entry) && typeof entry.message === 'string' && entry.message.trim().length > 0) {
      return entry.message;
    }
  }

  return null;
}

async function resolveHttpErrorMessage(
  error: HTTPError,
  options: ResolveHttpErrorMessageOptions = {},
) {
  try {
    const body = await error.response.clone().json();

    if (!isRecord(body)) {
      return null;
    }

    const errorsMessage = extractMessageFromErrorsField(body.errors);
    if (errorsMessage) {
      return errorsMessage;
    }

    if (typeof body.message === 'string') {
      return body.message;
    }

    if (typeof body.error === 'string') {
      return body.error;
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
