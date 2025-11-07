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

  test('errors 배열이 있으면 첫 메시지를 반환한다', async () => {
    const error = createHttpError(422, {
      errors: [
        { code: 'FIRST', message: '첫 번째 오류' },
        { code: 'SECOND', message: '두 번째 오류' },
      ],
    });

    await expect(resolveHttpErrorMessage(error)).resolves.toBe('첫 번째 오류');
  });

  test('error 필드만 있으면 해당 문자열을 반환한다', async () => {
    const error = createHttpError(500, { error: 'internal-error' });

    await expect(resolveHttpErrorMessage(error)).resolves.toBe('internal-error');
  });

  test('JSON 파싱이 실패하면 null을 반환한다', async () => {
    const response = new Response('plain text', { status: 500 });
    const request = new Request('https://example.com/api/test', { method: 'POST' });
    const error = new HTTPError(response, request, {} as any);

    await expect(resolveHttpErrorMessage(error)).resolves.toBeNull();
  });
});
