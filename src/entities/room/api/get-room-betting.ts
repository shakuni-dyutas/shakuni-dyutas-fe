import type { RoomBettingState } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomBettingResponse {
  betting: RoomBettingState['betting'];
}

async function getRoomBetting(roomId: string): Promise<RoomBettingState> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient.get(`rooms/${roomId}/betting`).json<GetRoomBettingResponse>();

  return { betting: response.betting };
}

export type { GetRoomBettingResponse };
export { getRoomBetting };
