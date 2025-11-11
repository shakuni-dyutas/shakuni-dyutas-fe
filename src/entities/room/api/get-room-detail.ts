import type { RoomDetail } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomDetailResponse {
  room: RoomDetail;
}

async function getRoomDetail(roomId: string): Promise<RoomDetail> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient.get(`rooms/${roomId}`).json<GetRoomDetailResponse>();

  return response.room;
}

export type { GetRoomDetailResponse };
export { getRoomDetail };
