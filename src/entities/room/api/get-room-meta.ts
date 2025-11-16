import type { RoomMeta } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomMetaResponse {
  meta: RoomMeta;
}

async function getRoomMeta(roomId: string): Promise<RoomMeta> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient.get(`rooms/${roomId}/meta`).json<GetRoomMetaResponse>();

  return response.meta;
}

export type { GetRoomMetaResponse };
export { getRoomMeta };
