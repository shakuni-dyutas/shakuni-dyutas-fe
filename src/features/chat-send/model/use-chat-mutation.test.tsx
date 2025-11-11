import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { NormalizedOptions } from 'ky';
import { HTTPError } from 'ky';
import { describe, expect, it, vi } from 'vitest';

import type { PostRoomChatResponse } from '@/features/chat-send/api/post-room-chat';
import { useChatMutation } from '@/features/chat-send/model/use-chat-mutation';

const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const postRoomChatMock = vi.fn();
const resolveHttpErrorMessageMock = vi.fn();

vi.mock('@/features/chat-send/api/post-room-chat', () => ({
  postRoomChat: (...args: unknown[]) => postRoomChatMock(...args),
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

describe('useChatMutation', () => {
  it('채팅 전송 성공 시 콜백과 토스트를 호출한다', async () => {
    const queryClient = createTestQueryClient();
    const onSuccess = vi.fn();
    const response: PostRoomChatResponse = {
      message: {
        id: 'chat-1',
        roomId: 'room-1',
        factionId: 'faction-alpha',
        author: {
          id: 'user-1',
          nickname: '사용자',
          avatarUrl: null,
        },
        body: 'hello',
        createdAt: '2025-11-11T00:00:00.000Z',
      },
    };
    postRoomChatMock.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useChatMutation({ onSuccess }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await act(async () => {
      await result.current.submitChat({
        roomId: 'room-1',
        authorId: 'user-1',
        factionId: 'faction-alpha',
        body: '안녕',
      });
    });

    expect(postRoomChatMock).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(response, expect.any(Object));
    expect(toastSuccessMock).not.toHaveBeenCalled();
  });

  it('HTTP 오류가 발생하면 메시지를 표시하고 콜백을 호출한다', async () => {
    const queryClient = createTestQueryClient();
    const onError = vi.fn();
    const httpError = new HTTPError(
      new Response(JSON.stringify({ message: '실패' }), { status: 400 }),
      new Request('https://example.com/rooms/room-1/chat-messages', { method: 'POST' }),
      {} as NormalizedOptions,
    );
    postRoomChatMock.mockRejectedValueOnce(httpError);
    resolveHttpErrorMessageMock.mockResolvedValueOnce('전송 실패');

    const { result } = renderHook(() => useChatMutation({ onError }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await act(async () => {
      await expect(
        result.current.submitChat({
          roomId: 'room-1',
          authorId: 'user-1',
          factionId: 'faction-alpha',
          body: '안녕',
        }),
      ).rejects.toThrowError();
    });

    expect(onError).toHaveBeenCalled();
    expect(resolveHttpErrorMessageMock).toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith('전송 실패');
  });
});
