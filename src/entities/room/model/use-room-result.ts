import { useQuery } from '@tanstack/react-query';

import { getRoomResult } from '../api/get-room-result';
import { ROOM_QUERY_KEYS } from './room-query-keys';

export interface UseRoomResultParams {
  roomId: string;
}

export function useRoomResult({ roomId }: UseRoomResultParams) {
  return useQuery({
    queryKey: ROOM_QUERY_KEYS.result(roomId),
    queryFn: () => getRoomResult({ roomId }),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}
