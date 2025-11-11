import type { RoomChatState } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomChatResponse {
  chatMessages: RoomChatState['chatMessages'];
}

async function getRoomChat(roomId: string): Promise<RoomChatState> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient.get(`rooms/${roomId}/chat`).json<GetRoomChatResponse>();

  return { chatMessages: response.chatMessages };
}

export type { GetRoomChatResponse };
export { getRoomChat };
