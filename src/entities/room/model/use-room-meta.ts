import { useQuery } from '@tanstack/react-query';

import { getRoomMeta } from '@/entities/room/api/get-room-meta';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';

function useRoomMeta(roomId: string) {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.meta(roomId),
    queryFn: () => getRoomMeta(roomId),
    enabled: Boolean(roomId),
  });
}

export { useRoomMeta };
