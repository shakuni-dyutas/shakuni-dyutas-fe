import type { RoomEvidenceState } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface EvidenceImagePayload {
  name: string;
  size: number;
  type: string;
}

interface PostRoomEvidenceRequest {
  roomId: string;
  factionId: string;
  authorId: string;
  summary: string;
  body: string;
  images: EvidenceImagePayload[];
}

interface PostRoomEvidenceResponse {
  evidenceGroups: RoomEvidenceState['evidenceGroups'];
  message?: string;
}

async function postRoomEvidence({
  roomId,
  ...payload
}: PostRoomEvidenceRequest): Promise<PostRoomEvidenceResponse> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient
    .post(`rooms/${roomId}/evidences`, {
      json: payload,
    })
    .json<PostRoomEvidenceResponse>();

  return response;
}

export type { EvidenceImagePayload, PostRoomEvidenceRequest, PostRoomEvidenceResponse };
export { postRoomEvidence };
