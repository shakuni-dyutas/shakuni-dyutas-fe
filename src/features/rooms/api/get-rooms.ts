import type { Room, RoomFilters } from '@/entities/room/types/room';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomsParams extends RoomFilters {}

interface GetRoomsResponse {
  rooms: Room[];
}

async function getRooms(params: GetRoomsParams = {}): Promise<GetRoomsResponse> {
  const searchParams = new URLSearchParams();

  // 서버/모킹에서는 기존 쿼리키 'status'를 사용하지만, 의미상 view를 전달
  if (params.view) searchParams.set('status', params.view);
  if (params.search) searchParams.set('search', params.search);
  if (params.sort) searchParams.set('sort', params.sort);

  const response = await apiClient
    .get(`rooms${searchParams.size ? `?${searchParams.toString()}` : ''}`)
    .json<GetRoomsResponse>();

  return response;
}

export type { GetRoomsParams, GetRoomsResponse };
export { getRooms };
