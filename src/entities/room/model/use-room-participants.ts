import { useQuery } from '@tanstack/react-query';

import { getRoomParticipants } from '@/entities/room/api/get-room-participants';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';

function useRoomParticipants(roomId: string) {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.participants(roomId),
    queryFn: () => getRoomParticipants(roomId),
    enabled: Boolean(roomId),
  });
}

export { useRoomParticipants };
