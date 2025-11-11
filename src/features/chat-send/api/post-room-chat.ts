import type { ChatMessage } from '@/entities/chat/types/chat-message';
import { apiClient } from '@/shared/api/api-client';

interface PostRoomChatRequest {
  roomId: string;
  authorId: string;
  factionId: string;
  body: string;
}

interface PostRoomChatResponse {
  message: ChatMessage;
  notice?: string;
}

async function postRoomChat({ roomId, ...payload }: PostRoomChatRequest) {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient
    .post(`rooms/${roomId}/chat-messages`, {
      json: payload,
    })
    .json<PostRoomChatResponse>();

  return response;
}

export type { PostRoomChatRequest, PostRoomChatResponse };
export { postRoomChat };
