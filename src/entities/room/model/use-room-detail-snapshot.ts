import { type QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getRoomDetail } from '@/entities/room/api/get-room-detail';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type {
  RoomBettingState,
  RoomChatState,
  RoomDetail,
  RoomEvidenceState,
  RoomMeta,
  RoomParticipants,
} from '@/entities/room/types/room-detail';

function cacheRoomSnapshot(roomId: string, snapshot: RoomDetail, queryClient: QueryClient) {
  const { participants, betting, evidenceGroups, chatMessages, ...meta } = snapshot;

  queryClient.setQueryData(ROOM_QUERY_KEYS.meta(roomId), meta as RoomMeta);
  queryClient.setQueryData(ROOM_QUERY_KEYS.participants(roomId), {
    participants,
  } as RoomParticipants);
  queryClient.setQueryData(ROOM_QUERY_KEYS.betting(roomId), {
    betting,
  } as RoomBettingState);
  queryClient.setQueryData(ROOM_QUERY_KEYS.evidence(roomId), {
    evidenceGroups,
  } as RoomEvidenceState);
  queryClient.setQueryData(ROOM_QUERY_KEYS.chat(roomId), {
    chatMessages,
  } as RoomChatState);
}

function useRoomDetailSnapshot(roomId: string | null) {
  const queryClient = useQueryClient();
  const detailKey = ROOM_QUERY_KEYS.detail(roomId ?? 'initial');

  const { data } = useQuery<RoomDetail>({
    queryKey: detailKey,
    queryFn: () => {
      if (!roomId) {
        throw new Error('roomId는 필수입니다.');
      }
      return getRoomDetail(roomId);
    },
    enabled: Boolean(roomId),
  });

  useEffect(() => {
    if (!roomId || !data) {
      return;
    }
    cacheRoomSnapshot(roomId, data, queryClient);
  }, [data, queryClient, roomId]);
}

export { useRoomDetailSnapshot };
