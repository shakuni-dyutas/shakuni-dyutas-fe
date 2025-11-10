import { useQuery } from '@tanstack/react-query';

import { getRoomDetail } from '@/entities/room/api/get-room-detail';

const ROOM_DETAIL_QUERY_KEY = 'room-detail';

function useRoomDetail(roomId: string) {
  return useQuery({
    queryKey: [ROOM_DETAIL_QUERY_KEY, roomId],
    queryFn: () => getRoomDetail(roomId),
    enabled: Boolean(roomId),
  });
}

export { useRoomDetail, ROOM_DETAIL_QUERY_KEY };
