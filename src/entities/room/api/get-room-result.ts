import { apiClient } from '@/shared/api/api-client';

import type { RoomResult } from '../types/room-result';

export interface GetRoomResultParams {
  roomId: string;
}

export interface GetRoomResultResponse {
  data: RoomResult;
}

export async function getRoomResult({ roomId }: GetRoomResultParams): Promise<RoomResult> {
  const response = await apiClient.get(`rooms/${roomId}/result`).json<GetRoomResultResponse>();

  return response.data;
}
