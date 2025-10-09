import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from 'vitest';
import { GOOGLE_OAUTH_ERROR_MESSAGES } from '@/features/auth/google/config/google-oauth-config';
import * as sessionService from '@/features/auth/session/model/session-service';
import { server } from '@/shared/mocks/server';
import { LoginPanel } from './login-panel';

const replaceMock = vi.fn();
const loginSpy = vi.fn();
let latestLoginOptions: {
  onSuccess?: (response: { code: string; scope: string }) => void;
  onError?: (error: { error_description?: string }) => void;
} | null = null;
let completeGoogleLoginSpy: MockInstance;
let isGoogleClientConfiguredForTest = true;

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: (options: typeof latestLoginOptions) => {
    latestLoginOptions = options ?? null;
    return loginSpy;
  },
}));

vi.mock('@/features/auth/google/config/google-oauth-config', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/auth/google/config/google-oauth-config')
  >('@/features/auth/google/config/google-oauth-config');

  return {
    ...actual,
    GOOGLE_CLIENT_ID: 'test-client-id',
    get IS_GOOGLE_CLIENT_CONFIGURED() {
      return isGoogleClientConfiguredForTest;
    },
  };
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

describe('LoginPanel', () => {
  const activeClients: QueryClient[] = [];

  beforeEach(() => {
    isGoogleClientConfiguredForTest = true;
    replaceMock.mockReset();
    loginSpy.mockReset();
    latestLoginOptions = null;
    completeGoogleLoginSpy = vi.spyOn(sessionService, 'completeGoogleLogin');
    loginSpy.mockImplementation(() => {
      latestLoginOptions?.onSuccess?.({ code: 'valid-code', scope: 'profile email' });
    });
  });

  afterEach(() => {
    completeGoogleLoginSpy.mockRestore();
    activeClients.forEach((client) => {
      client.clear();
    });
    activeClients.length = 0;
  });

  test('Google 로그인 성공 시 홈으로 리디렉션한다', async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    activeClients.push(queryClient);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPanel />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Google 계정으로 계속하기' });

    await user.click(button);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/');
    });

    expect(completeGoogleLoginSpy).toHaveBeenCalledWith({ code: 'valid-code' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('redirectUri가 전달되면 해당 경로로 리디렉션한다', async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    activeClients.push(queryClient);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPanel redirectUri="/profile" />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Google 계정으로 계속하기' });

    await user.click(button);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/profile');
    });

    expect(completeGoogleLoginSpy).toHaveBeenCalledWith({
      code: 'valid-code',
      redirectUri: '/profile',
    });
  });

  test('Google 로그인 실패 시 서버 메시지를 표시한다', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('*/auth/google', () =>
        HttpResponse.json({ message: '유효하지 않은 코드예요.' }, { status: 400 }),
      ),
    );

    loginSpy.mockImplementation(() => {
      latestLoginOptions?.onSuccess?.({ code: 'invalid-code', scope: 'profile email' });
    });

    const queryClient = createTestQueryClient();
    activeClients.push(queryClient);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPanel />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Google 계정으로 계속하기' });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('유효하지 않은 코드예요.');
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('DOMException(취소) 발생 시 취소 메시지를 표시한다', async () => {
    const user = userEvent.setup();

    completeGoogleLoginSpy.mockRejectedValueOnce(
      new DOMException('The operation was aborted.', 'AbortError'),
    );

    const queryClient = createTestQueryClient();
    activeClients.push(queryClient);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPanel />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Google 계정으로 계속하기' });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        '로그인이 취소되었어요. 다시 진행해주세요.',
      );
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('서버 오류 응답 시 기본 오류 메시지를 표시한다', async () => {
    const user = userEvent.setup();

    loginSpy.mockImplementation(() => {
      latestLoginOptions?.onSuccess?.({ code: 'server-error', scope: 'profile email' });
    });

    const queryClient = createTestQueryClient();
    activeClients.push(queryClient);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPanel />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Google 계정으로 계속하기' });

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        '서버에서 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      );
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('client id가 없으면 안내 메시지와 함께 버튼이 비활성화된다', async () => {
    isGoogleClientConfiguredForTest = false;

    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    activeClients.push(queryClient);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPanel />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: 'Google 계정으로 계속하기' });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(loginSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      GOOGLE_OAUTH_ERROR_MESSAGES.CLIENT_ID_MISSING,
    );
  });
});
