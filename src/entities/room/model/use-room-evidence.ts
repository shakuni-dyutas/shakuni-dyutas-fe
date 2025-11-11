import { useQuery } from '@tanstack/react-query';

import { getRoomEvidence } from '@/entities/room/api/get-room-evidence';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';

function useRoomEvidence(roomId: string) {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.evidence(roomId),
    queryFn: () => getRoomEvidence(roomId),
    enabled: Boolean(roomId),
  });
}

export { useRoomEvidence };
