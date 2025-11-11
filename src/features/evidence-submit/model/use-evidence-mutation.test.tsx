import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { HTTPError } from 'ky';
import { describe, expect, it, vi } from 'vitest';

import type { PostRoomEvidenceResponse } from '@/features/evidence-submit/api/post-room-evidence';
import { useEvidenceMutation } from '@/features/evidence-submit/model/use-evidence-mutation';

const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const postRoomEvidenceMock = vi.fn();
const resolveHttpErrorMessageMock = vi.fn();

vi.mock('@/features/evidence-submit/api/post-room-evidence', () => ({
  postRoomEvidence: (...args: unknown[]) => postRoomEvidenceMock(...args),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

vi.mock('@/shared/lib/http/resolve-http-error-message', () => ({
  resolveHttpErrorMessage: (...args: unknown[]) => resolveHttpErrorMessageMock(...args),
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

describe('useEvidenceMutation', () => {
  it('submits evidence successfully and calls callback', async () => {
    const queryClient = createTestQueryClient();
    const onSuccess = vi.fn();
    const response: PostRoomEvidenceResponse = {
      evidenceGroups: [],
      message: 'ok',
    };
    postRoomEvidenceMock.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useEvidenceMutation({ roomId: 'room-1', onSuccess }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await act(async () => {
      await result.current.submitEvidence({
        factionId: 'faction-alpha',
        authorId: 'user-1',
        summary: '요약',
        body: '본문',
        images: [],
      });
    });

    expect(postRoomEvidenceMock).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(response);
    expect(toastSuccessMock).toHaveBeenCalled();
  });

  it('handles HTTP errors gracefully', async () => {
    const queryClient = createTestQueryClient();
    const httpError = new HTTPError(
      new Response(JSON.stringify({ message: '제한 위반' }), { status: 400 }),
      new Request('https://example.com/rooms/room-1/evidences'),
      { method: 'POST' },
    );
    postRoomEvidenceMock.mockRejectedValueOnce(httpError);
    resolveHttpErrorMessageMock.mockResolvedValueOnce('제출 제한');

    const { result } = renderHook(() => useEvidenceMutation({ roomId: 'room-1' }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await act(async () => {
      await expect(
        result.current.submitEvidence({
          factionId: 'faction-alpha',
          authorId: 'user-1',
          summary: '요약',
          body: '본문',
          images: [],
        }),
      ).rejects.toThrowError();
    });

    expect(resolveHttpErrorMessageMock).toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith('제출 제한');
  });
});
