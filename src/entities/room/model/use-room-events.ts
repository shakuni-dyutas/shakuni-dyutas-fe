import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant } from '@/entities/participant/types/participant';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type { RoomBettingState, RoomDetail } from '@/entities/room/types/room-detail';
import type { RoomServerEvent } from '@/entities/room/types/room-event';
import type { TeamFactionId } from '@/entities/team/types/team-faction';
import { createEventSource, type SseConnectionState } from '@/shared/api/sse-client';

interface RoomEventHandlers {
  onRoomEnding?: (data: Extract<RoomServerEvent, { type: 'room-ending' }>['data']) => void;
  onRoomEnded?: (data: Extract<RoomServerEvent, { type: 'room-ended' }>['data']) => void;
}

function useRoomEvents(roomId: string | null, handlers: RoomEventHandlers = {}) {
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

    const handleChat = (event: MessageEvent<string>) => {
      const payload = parseJson<{ message: ChatMessage }>(event.data);
      if (!payload) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => {
          if (!previous) {
            return previous;
          }
          return {
            ...previous,
            chatMessages: [
              payload.message,
              ...previous.chatMessages.filter((message) => message.id !== payload.message.id),
            ],
          };
        },
      );
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
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => {
          if (!previous) {
            return previous;
          }

          const groups = previous.evidenceGroups ?? [];
          const groupIndex = groups.findIndex((group) => group.factionId === factionId);
          if (groupIndex >= 0) {
            return {
              ...previous,
              evidenceGroups: groups.map((group, index) =>
                index === groupIndex
                  ? {
                      ...group,
                      submissions: [
                        payload.submission,
                        ...group.submissions.filter((item) => item.id !== payload.submission.id),
                      ],
                    }
                  : group,
              ),
            };
          }

          return {
            ...previous,
            evidenceGroups: [
              {
                factionId,
                factionName: payload.factionName,
                submissions: [payload.submission],
              },
              ...groups,
            ],
          };
        },
      );
    };

    const handleParticipant = (event: MessageEvent<string>) => {
      const payload = parseJson<{ participant: Participant }>(event.data);
      if (!payload) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            participants: [
              payload.participant,
              ...previous.participants.filter(
                (participant) => participant.id !== payload.participant.id,
              ),
            ],
          };
        },
      );
    };

    const handleBetting = (event: MessageEvent<string>) => {
      const payload = parseJson<{
        betting: RoomBettingState['betting'];
      }>(event.data);

      if (!payload) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) =>
          previous
            ? ({
                ...previous,
                betting: payload.betting,
              } satisfies RoomDetail)
            : previous,
      );
    };

    const handleRoomEnding = (event: MessageEvent<string>) => {
      const payload = parseJson<Extract<RoomServerEvent, { type: 'room-ending' }>['data']>(
        event.data,
      );
      if (!payload) {
        return;
      }
      handlers.onRoomEnding?.(payload);
    };

    const handleRoomEnded = (event: MessageEvent<string>) => {
      const payload = parseJson<Extract<RoomServerEvent, { type: 'room-ended' }>['data']>(
        event.data,
      );
      if (!payload) {
        return;
      }
      handlers.onRoomEnded?.(payload);
    };

    eventSource.addEventListener('chat-updated', handleChat);
    eventSource.addEventListener('evidence-updated', handleEvidence);
    eventSource.addEventListener('participant-updated', handleParticipant);
    eventSource.addEventListener('betting-updated', handleBetting);
    eventSource.addEventListener('room-ending', handleRoomEnding);
    eventSource.addEventListener('room-ended', handleRoomEnded);

    return () => {
      eventSource.removeEventListener('chat-updated', handleChat);
      eventSource.removeEventListener('evidence-updated', handleEvidence);
      eventSource.removeEventListener('participant-updated', handleParticipant);
      eventSource.removeEventListener('betting-updated', handleBetting);
      eventSource.removeEventListener('room-ending', handleRoomEnding);
      eventSource.removeEventListener('room-ended', handleRoomEnded);
      eventSource.close();
    };
  }, [handlers.onRoomEnded, handlers.onRoomEnding, queryClient, roomId]);

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
export type { RoomEventHandlers };
