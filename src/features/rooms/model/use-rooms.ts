import { useQuery } from '@tanstack/react-query';

import type { RoomFilters } from '@/entities/room/types/room';
import { getRooms } from '@/features/rooms/api/get-rooms';

const ROOMS_QUERY_KEY = 'rooms';

function useRooms(filters: RoomFilters = {}) {
  return useQuery({
    queryKey: [ROOMS_QUERY_KEY, filters],
    queryFn: () => getRooms(filters),
    select: (data) => data.rooms,
  });
}

export { useRooms };
