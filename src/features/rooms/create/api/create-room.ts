import { apiClient } from '@/shared/api/api-client';

interface CreateRoomFactionRequest {
  title: string;
  description: string;
}

interface CreateRoomRequest {
  title: string;
  description: string;
  timeLimitMinutes: number;
  minBetPoint: number;
  visibility: 'public' | 'private';
  password?: string;
  factions: CreateRoomFactionRequest[];
}

interface CreateRoomResponse {
  roomId: string;
  redirectPath?: string;
}

async function createRoom(request: CreateRoomRequest): Promise<CreateRoomResponse> {
  const response = await apiClient
    .post('rooms', {
      json: request,
    })
    .json<CreateRoomResponse>();

  return response;
}

export type { CreateRoomFactionRequest, CreateRoomRequest, CreateRoomResponse };
export { createRoom };
