import type { RoomEvidenceState } from '@/entities/room/types/room-detail';
import { apiClient } from '@/shared/api/api-client';

interface GetRoomEvidenceResponse {
  evidenceGroups: RoomEvidenceState['evidenceGroups'];
}

async function getRoomEvidence(roomId: string): Promise<RoomEvidenceState> {
  if (!roomId) {
    throw new Error('roomId는 필수입니다.');
  }

  const response = await apiClient.get(`rooms/${roomId}/evidence`).json<GetRoomEvidenceResponse>();

  return { evidenceGroups: response.evidenceGroups };
}

export type { GetRoomEvidenceResponse };
export { getRoomEvidence };
