import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useBetMutation } from '@/features/bet-place/model/use-bet-mutation';

const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

describe('useBetMutation', () => {
  it('submits a bet successfully', async () => {
    const queryClient = createTestQueryClient();
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useBetMutation({ roomId: 'room-mock-1', onSuccess }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await act(async () => {
      await result.current.submitBet({ factionId: 'faction-alpha', points: 200 });
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(toastSuccessMock).toHaveBeenCalled();
  });

  it('handles validation error', async () => {
    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useBetMutation({ roomId: 'room-mock-1' }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await act(async () => {
      await expect(
        result.current.submitBet({ factionId: 'faction-alpha', points: 10 }),
      ).rejects.toThrowError();
    });

    expect(toastErrorMock).toHaveBeenCalled();
  });
});
