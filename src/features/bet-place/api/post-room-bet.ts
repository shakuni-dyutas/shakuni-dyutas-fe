import type { RoomBettingState, RoomFactionSnapshot } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface PostRoomBetRequest {
  roomId: string;
  factionId: string;
  points: number;
}

interface PostRoomBetResponse {
  betting: RoomBettingState['betting'];
  factions: RoomFactionSnapshot[];
  message?: string;
}

async function postRoomBet({ roomId, factionId, points }: PostRoomBetRequest) {
  const response = await apiClient
    .post(`rooms/${roomId}/bets`, {
      json: { factionId, points },
    })
    .json<PostRoomBetResponse>();

  return response;
}

export type { PostRoomBetRequest, PostRoomBetResponse };
export { postRoomBet };
