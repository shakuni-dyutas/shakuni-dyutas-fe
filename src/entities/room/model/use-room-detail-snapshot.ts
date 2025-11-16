import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getRoomDetail } from '@/entities/room/api/get-room-detail';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type { RoomDetail } from '@/entities/room/types/room-detail';

function useRoomDetailSnapshot(roomId: string | null) {
  const queryClient = useQueryClient();
  const detailKey = ROOM_QUERY_KEYS.detail(roomId ?? 'initial');

  const query = useQuery<RoomDetail>({
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
    if (!roomId || !query.data) {
      return;
    }

    queryClient.setQueryData(ROOM_QUERY_KEYS.detail(roomId), query.data);
  }, [query.data, queryClient, roomId]);

  return query;
}

export { useRoomDetailSnapshot };
