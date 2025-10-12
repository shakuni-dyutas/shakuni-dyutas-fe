import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HTTPError } from 'ky';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { resolveRedirectPath } from '@/features/auth/google/lib/resolve-redirect-path';
import { useCompleteGoogleLogin } from '@/features/auth/google/model/use-complete-google-login';
import { resolveHttpErrorMessage } from '@/shared/lib/http/resolve-http-error-message';

type WrapperProps = {
  children: ReactNode;
};

const replaceMock = vi.fn();
const completeGoogleLoginMock = vi.fn();
const CANCELLED_MESSAGE = '로그인이 취소되었어요. 다시 진행해주세요.';
const DEFAULT_ERROR_MESSAGE = '로그인에 실패했어요. 잠시 후 다시 시도해주세요.';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('@/features/auth/session/model/session-service', () => ({
  completeGoogleLogin: (...args: Parameters<typeof completeGoogleLoginMock>) =>
    completeGoogleLoginMock(...args),
}));

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: WrapperProps) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

function createHttpError(status: number, body: unknown) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
  const request = new Request('https://example.com/auth/google', { method: 'POST' });
  return new HTTPError(response, request, {} as any);
}

describe('resolveRedirectPath', () => {
  test('유효한 상대 경로를 그대로 반환한다', () => {
    expect(resolveRedirectPath('/arena/123')).toBe('/arena/123');
  });

  test('잘못된 경로는 홈으로 대체한다', () => {
    expect(resolveRedirectPath('https://malicious.example')).toBe('/');
    expect(resolveRedirectPath('//double-slash')).toBe('/');
    expect(resolveRedirectPath(undefined)).toBe('/');
  });
});

describe('resolveHttpErrorMessage', () => {
  test('응답 본문에 message가 있으면 반환한다', async () => {
    const error = createHttpError(400, { message: '유효하지 않은 코드예요.' });

    await expect(resolveHttpErrorMessage(error)).resolves.toBe('유효하지 않은 코드예요.');
  });

  test('message가 없으면 null을 반환한다', async () => {
    const error = createHttpError(500, { error: 'internal-error' });

    await expect(resolveHttpErrorMessage(error)).resolves.toBeNull();
  });

  test('JSON 파싱이 실패하면 null을 반환한다', async () => {
    const response = new Response('plain text', { status: 500 });
    const request = new Request('https://example.com/auth/google', { method: 'POST' });
    const error = new HTTPError(response, request, {} as any);

    await expect(resolveHttpErrorMessage(error)).resolves.toBeNull();
  });
});

describe('useCompleteGoogleLogin', () => {
  const activeClients: QueryClient[] = [];

  beforeEach(() => {
    replaceMock.mockReset();
    completeGoogleLoginMock.mockReset();
  });

  afterEach(() => {
    activeClients.forEach((client) => {
      client.clear();
    });
    activeClients.length = 0;
  });

  function createTestQueryClient() {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    activeClients.push(client);
    return client;
  }

  test('로그인 완료 후 redirectUri로 이동한다', async () => {
    const client = createTestQueryClient();
    const wrapper = createWrapper(client);
    completeGoogleLoginMock.mockResolvedValueOnce({ accessToken: 'token' });

    const { result } = renderHook(() => useCompleteGoogleLogin(), { wrapper });

    act(() => {
      result.current.completeLogin({ code: 'valid-code', redirectUri: '/profile' });
    });

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/profile');
    });

    expect(completeGoogleLoginMock).toHaveBeenCalledWith({
      code: 'valid-code',
      redirectUri: '/profile',
    });
    expect(result.current.errorMessage).toBeNull();
  });

  test('잘못된 redirectUri는 홈으로 대체한다', async () => {
    const client = createTestQueryClient();
    const wrapper = createWrapper(client);
    completeGoogleLoginMock.mockResolvedValueOnce({ accessToken: 'token' });

    const { result } = renderHook(() => useCompleteGoogleLogin(), { wrapper });

    act(() => {
      result.current.completeLogin({ code: 'valid-code', redirectUri: 'javascript:alert(1)' });
    });

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/');
    });

    expect(completeGoogleLoginMock).toHaveBeenCalledWith({
      code: 'valid-code',
      redirectUri: 'javascript:alert(1)',
    });
  });

  test('DOMException이 발생하면 취소 메시지를 노출한다', async () => {
    const client = createTestQueryClient();
    const wrapper = createWrapper(client);
    completeGoogleLoginMock.mockRejectedValueOnce(
      new DOMException('The request was aborted', 'AbortError'),
    );

    const { result } = renderHook(() => useCompleteGoogleLogin(), { wrapper });

    act(() => {
      result.current.completeLogin({ code: 'cancelled' });
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(CANCELLED_MESSAGE);
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('HTTPError가 발생하면 서버 메시지를 노출한다', async () => {
    const client = createTestQueryClient();
    const wrapper = createWrapper(client);
    const error = createHttpError(500, {
      message: '서버에서 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
    });
    completeGoogleLoginMock.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCompleteGoogleLogin(), { wrapper });

    act(() => {
      result.current.completeLogin({ code: 'server-error' });
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        '서버에서 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      );
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('HTTPError 메시지가 없으면 기본 메시지를 노출한다', async () => {
    const client = createTestQueryClient();
    const wrapper = createWrapper(client);
    const error = createHttpError(500, { error: 'internal-error' });
    completeGoogleLoginMock.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCompleteGoogleLogin(), { wrapper });

    act(() => {
      result.current.completeLogin({ code: 'server-error' });
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(DEFAULT_ERROR_MESSAGE);
    });
  });

  test('resetError로 에러 상태를 초기화한다', async () => {
    const client = createTestQueryClient();
    const wrapper = createWrapper(client);
    completeGoogleLoginMock.mockRejectedValueOnce(new Error('unexpected-error'));

    const { result } = renderHook(() => useCompleteGoogleLogin(), { wrapper });

    act(() => {
      result.current.completeLogin({ code: 'unknown' });
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(DEFAULT_ERROR_MESSAGE);
    });

    act(() => {
      result.current.resetError();
    });

    expect(result.current.errorMessage).toBeNull();
  });
});
