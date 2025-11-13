import { describe, expect, it } from 'vitest';

import { apiClient } from '@/shared/api/api-client';
import { createEventSource } from '@/shared/api/sse-client';

describe('createEventSource', () => {
  it('MSW SSE 스트림에서 chat-created 이벤트를 수신한다', async () => {
    const roomId = 'room-sse-test';
    const connection = createEventSource(`rooms/${roomId}/events`);
    expect(connection).not.toBeNull();

    const received = new Promise<{ body: string; id: string }>((resolve) => {
      connection?.addEventListener('chat-created', (event) => {
        const payload = JSON.parse(event.data ?? '{}') as {
          message?: { id: string; body: string };
        };
        if (payload.message) {
          resolve({ body: payload.message.body, id: payload.message.id });
        }
      });
    });

    await apiClient
      .post(`rooms/${roomId}/chat-messages`, {
        json: {
          authorId: 'user-1',
          factionId: 'faction-alpha',
          body: '실시간 채팅 메시지',
        },
      })
      .json();

    const message = await received;
    expect(message.body).toBe('실시간 채팅 메시지');
    expect(message.id).toMatch(/^chat-/);

    connection?.close();
  });
});
