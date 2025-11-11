import type { RoomParticipants } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomParticipantsResponse {
  participants: RoomParticipants['participants'];
}

async function getRoomParticipants(roomId: string): Promise<RoomParticipants> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient
    .get(`rooms/${roomId}/participants`)
    .json<GetRoomParticipantsResponse>();

  return { participants: response.participants };
}

export type { GetRoomParticipantsResponse };
export { getRoomParticipants };
