import type { RoomDetail } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

async function getRoomDetail(roomId: string): Promise<RoomDetail> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  return apiClient.get(`rooms/${roomId}/detail`).json<RoomDetail>();
}

export { getRoomDetail };
