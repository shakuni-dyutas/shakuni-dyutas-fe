import type { RoomEvidenceState } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface PostRoomEvidenceRequest {
  roomId: string;
  factionId: string;
  authorId: string;
  summary: string;
  body: string;
  images: File[];
}

interface PostRoomEvidenceResponse {
  evidenceGroups: RoomEvidenceState['evidenceGroups'];
  message?: string;
}

async function postRoomEvidence({
  roomId,
  images,
  factionId,
  authorId,
  summary,
  body,
}: PostRoomEvidenceRequest): Promise<PostRoomEvidenceResponse> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const formData = new FormData();
  formData.set('factionId', factionId);
  formData.set('authorId', authorId);
  formData.set('summary', summary);
  formData.set('body', body);

  images.forEach((file) => {
    formData.append('images', file);
  });

  const response = await apiClient
    .post(`rooms/${roomId}/evidences`, {
      body: formData,
    })
    .json<PostRoomEvidenceResponse>();

  return response;
}

export type { PostRoomEvidenceRequest, PostRoomEvidenceResponse };
export { postRoomEvidence };
