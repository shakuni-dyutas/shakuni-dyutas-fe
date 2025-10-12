import { HTTPError } from 'ky';
import { describe, expect, test } from 'vitest';

import { resolveHttpErrorMessage } from '@/shared/lib/http/resolve-http-error-message';

function createHttpError(status: number, body: unknown) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
  const request = new Request('https://example.com/api/test', { method: 'POST' });
  return new HTTPError(response, request, {} as any);
}

describe('resolveHttpErrorMessage', () => {
  test('응답 본문에 message가 있으면 반환한다', async () => {
    const error = createHttpError(400, { message: '요청이 유효하지 않아요.' });

    await expect(resolveHttpErrorMessage(error)).resolves.toBe('요청이 유효하지 않아요.');
  });

  test('message가 없으면 null을 반환한다', async () => {
    const error = createHttpError(500, { error: 'internal-error' });

    await expect(resolveHttpErrorMessage(error)).resolves.toBeNull();
  });

  test('JSON 파싱이 실패하면 null을 반환한다', async () => {
    const response = new Response('plain text', { status: 500 });
    const request = new Request('https://example.com/api/test', { method: 'POST' });
    const error = new HTTPError(response, request, {} as any);

    await expect(resolveHttpErrorMessage(error)).resolves.toBeNull();
  });
});
