import { describe, expect, it } from 'vitest';

import { apiClient } from '@/shared/api/api-client';
import { createEventSource } from '@/shared/api/sse-client';

describe('createEventSource', () => {
  it('MSW SSE 스트림에서 chat-updated 이벤트를 수신한다', async () => {
    const roomId = 'room-sse-test';
    const connection = createEventSource(`rooms/${roomId}/events`);
    expect(connection).not.toBeNull();

    const received = new Promise<{ body: string; id: string }>((resolve) => {
      connection?.addEventListener('chat-updated', (event) => {
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

  it('MSW SSE 스트림에서 betting-updated 이벤트를 수신한다', async () => {
    const roomId = 'room-sse-bet-test';
    const connection = createEventSource(`rooms/${roomId}/events`);
    expect(connection).not.toBeNull();

    const received = new Promise<{ totalPoolPoints: number }>((resolve) => {
      connection?.addEventListener('betting-updated', (event) => {
        const payload = JSON.parse(event.data ?? '{}') as {
          betting?: { totalPoolPoints?: number };
        };

        if (payload.betting?.totalPoolPoints !== undefined) {
          resolve({ totalPoolPoints: payload.betting.totalPoolPoints });
        }
      });
    });

    await apiClient
      .post(`rooms/${roomId}/bets`, {
        json: {
          factionId: 'faction-alpha',
          points: 200,
        },
      })
      .json();

    const betting = await received;
    expect(betting.totalPoolPoints).toBeGreaterThan(0);

    connection?.close();
  });

  it('MSW SSE 스트림에서 evidence-updated와 participant-updated 이벤트를 수신한다', async () => {
    const roomId = 'room-sse-evidence-test';
    const connection = createEventSource(`rooms/${roomId}/events`);
    expect(connection).not.toBeNull();

    const evidenceReceived = new Promise<{ submissionId: string }>((resolve) => {
      connection?.addEventListener('evidence-updated', (event) => {
        const payload = JSON.parse(event.data ?? '{}') as {
          submission?: { id: string };
        };

        if (payload.submission?.id) {
          resolve({ submissionId: payload.submission.id });
        }
      });
    });

    const participantReceived = new Promise<{ participantId: string }>((resolve) => {
      connection?.addEventListener('participant-updated', (event) => {
        const payload = JSON.parse(event.data ?? '{}') as {
          participant?: { id: string };
        };

        if (payload.participant?.id) {
          resolve({ participantId: payload.participant.id });
        }
      });
    });

    const formData = new FormData();
    formData.set('factionId', 'faction-alpha');
    formData.set('authorId', 'user-9');
    formData.set('summary', '테스트 증거');
    formData.set('body', '증거 본문');

    await apiClient
      .post(`rooms/${roomId}/evidences`, {
        body: formData,
      })
      .json();

    await apiClient
      .post(`rooms/${roomId}/bets`, {
        json: {
          factionId: 'faction-alpha',
          points: 150,
        },
      })
      .json();

    const evidence = await evidenceReceived;
    const participant = await participantReceived;

    expect(evidence.submissionId).toMatch(/^evidence-/);
    expect(participant.participantId).toBeTruthy();

    connection?.close();
  });
});
