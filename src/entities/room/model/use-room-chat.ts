import { useQuery } from '@tanstack/react-query';

import { getRoomChat } from '@/entities/room/api/get-room-chat';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';

function useRoomChat(roomId: string) {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.chat(roomId),
    queryFn: () => getRoomChat(roomId),
    enabled: Boolean(roomId),
  });
}

export { useRoomChat };
