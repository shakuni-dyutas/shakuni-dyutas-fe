import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant } from '@/entities/participant/types/participant';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type {
  RoomBettingState,
  RoomChatState,
  RoomDetail,
  RoomEvidenceState,
  RoomParticipants,
} from '@/entities/room/types/room-detail';
import type { TeamFactionId } from '@/entities/team/types/team-faction';
import { createEventSource, type SseConnectionState } from '@/shared/api/sse-client';

function useRoomEvents(roomId: string | null) {
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<SseConnectionState>('idle');
  const [lastError, setLastError] = useState<Error | null>(null);

  useEffect(() => {
    if (!roomId || typeof window === 'undefined') {
      setConnectionState('idle');
      setLastError(null);
      return;
    }

    const eventSource = createEventSource(`rooms/${roomId}/events`, {
      onConnectionStateChange: (state) => {
        setConnectionState(state);
        if (state === 'open') {
          setLastError(null);
        }
      },
      onError: (error) => {
        setLastError(error instanceof Error ? error : new Error('SSE 연결 오류'));
      },
    });

    if (!eventSource) {
      setConnectionState('error');
      setLastError(new Error('SSE 연결을 초기화할 수 없습니다.'));
      return;
    }

    const syncDetail = (updater: (detail: RoomDetail) => RoomDetail) => {
      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => (previous ? updater(previous) : previous),
      );
    };

    const handleChat = (event: MessageEvent<string>) => {
      const payload = parseJson<{ message: ChatMessage }>(event.data);
      if (!payload) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.chat(roomId),
        (previous: RoomChatState | undefined) => {
          const chatMessages = previous?.chatMessages ?? [];
          const nextMessages = [
            payload.message,
            ...chatMessages.filter((message) => message.id !== payload.message.id),
          ];
          return { chatMessages: nextMessages } satisfies RoomChatState;
        },
      );
      syncDetail((detail) => ({
        ...detail,
        chatMessages: [
          payload.message,
          ...detail.chatMessages.filter((message) => message.id !== payload.message.id),
        ],
      }));
    };

    const handleEvidence = (event: MessageEvent<string>) => {
      const payload = parseJson<{
        submission: EvidenceItem;
        factionId: string;
        factionName: string;
      }>(event.data);

      if (!payload) {
        return;
      }

      const factionId = payload.factionId as TeamFactionId;

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.evidence(roomId),
        (previous: RoomEvidenceState | undefined): RoomEvidenceState => {
          const groups = previous?.evidenceGroups ?? [];
          const groupIndex = groups.findIndex((group) => group.factionId === factionId);
          if (groupIndex >= 0) {
            const nextGroups = groups.map((group, index) =>
              index === groupIndex
                ? {
                    ...group,
                    submissions: [
                      payload.submission,
                      ...group.submissions.filter((item) => item.id !== payload.submission.id),
                    ],
                  }
                : group,
            );
            return { evidenceGroups: nextGroups } satisfies RoomEvidenceState;
          }

          return {
            evidenceGroups: [
              {
                factionId,
                factionName: payload.factionName,
                submissions: [payload.submission],
              },
              ...groups,
            ],
          } satisfies RoomEvidenceState;
        },
      );
      syncDetail((detail) => {
        const groups = detail.evidenceGroups ?? [];
        const groupIndex = groups.findIndex((group) => group.factionId === factionId);
        if (groupIndex >= 0) {
          const nextGroups = groups.map((group, index) =>
            index === groupIndex
              ? {
                  ...group,
                  submissions: [
                    payload.submission,
                    ...group.submissions.filter((item) => item.id !== payload.submission.id),
                  ],
                }
              : group,
          );
          return {
            ...detail,
            evidenceGroups: nextGroups,
          };
        }

        return {
          ...detail,
          evidenceGroups: [
            {
              factionId,
              factionName: payload.factionName,
              submissions: [payload.submission],
            },
            ...groups,
          ],
        };
      });
    };

    const handleParticipant = (event: MessageEvent<string>) => {
      const payload = parseJson<{ participant: Participant }>(event.data);
      if (!payload) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.participants(roomId),
        (previous: RoomParticipants | undefined): RoomParticipants => {
          const participants = previous?.participants ?? [];
          const nextParticipants = [
            payload.participant,
            ...participants.filter((participant) => participant.id !== payload.participant.id),
          ];

          return { participants: nextParticipants } satisfies RoomParticipants;
        },
      );
      syncDetail((detail) => ({
        ...detail,
        participants: [
          payload.participant,
          ...detail.participants.filter((participant) => participant.id !== payload.participant.id),
        ],
      }));
    };

    const handleBetting = (event: MessageEvent<string>) => {
      const payload = parseJson<{
        betting: RoomBettingState['betting'];
      }>(event.data);

      if (!payload) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.betting(roomId),
        (): RoomBettingState => ({ betting: payload.betting }),
      );
      syncDetail((detail) => ({
        ...detail,
        betting: payload.betting,
      }));
    };

    eventSource.addEventListener('chat-updated', handleChat);
    eventSource.addEventListener('evidence-updated', handleEvidence);
    eventSource.addEventListener('participant-updated', handleParticipant);
    eventSource.addEventListener('betting-updated', handleBetting);

    return () => {
      eventSource.removeEventListener('chat-updated', handleChat);
      eventSource.removeEventListener('evidence-updated', handleEvidence);
      eventSource.removeEventListener('participant-updated', handleParticipant);
      eventSource.removeEventListener('betting-updated', handleBetting);
      eventSource.close();
    };
  }, [roomId, queryClient]);

  return { connectionState, lastError };
}

function parseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch (_error) {
    return null;
  }
}

export { useRoomEvents };
