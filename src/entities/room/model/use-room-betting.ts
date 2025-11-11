import { useQuery } from '@tanstack/react-query';

import { getRoomBetting } from '@/entities/room/api/get-room-betting';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';

function useRoomBetting(roomId: string) {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.betting(roomId),
    queryFn: () => getRoomBetting(roomId),
    enabled: Boolean(roomId),
  });
}

export { useRoomBetting };
