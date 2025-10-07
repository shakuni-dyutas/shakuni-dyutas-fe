import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { server } from '@/shared/mocks/server';
import { LoginPanel } from './login-panel';

const replaceMock = vi.fn();
const loginSpy = vi.fn();
let latestLoginOptions: {
  onSuccess?: (response: { code: string; scope: string }) => void;
  onError?: (error: { error_description?: string }) => void;
} | null = null;

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
    IS_GOOGLE_CLIENT_CONFIGURED: true,
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
    replaceMock.mockReset();
    loginSpy.mockReset();
    latestLoginOptions = null;
    loginSpy.mockImplementation(() => {
      latestLoginOptions?.onSuccess?.({ code: 'valid-code', scope: 'profile email' });
    });
  });

  afterEach(() => {
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

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
});
