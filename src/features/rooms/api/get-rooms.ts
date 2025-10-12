import type { Room, RoomFilters } from '@/entities/room/types/room';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomsParams extends RoomFilters {}

interface GetRoomsResponse {
  rooms: Room[];
}

async function getRooms(params: GetRoomsParams = {}): Promise<GetRoomsResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) searchParams.set('status', params.status);
  if (params.search) searchParams.set('search', params.search);
  if (params.sort) searchParams.set('sort', params.sort);

  const response = await apiClient
    .get(`rooms${searchParams.size ? `?${searchParams.toString()}` : ''}`)
    .json<GetRoomsResponse>();

  return response;
}

export type { GetRoomsParams, GetRoomsResponse };
export { getRooms };
