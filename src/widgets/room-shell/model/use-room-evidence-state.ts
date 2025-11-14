import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import type { Participant } from '@/entities/participant/types/participant';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { useEvidenceMutation } from '@/features/evidence-submit/model/use-evidence-mutation';
import type { EvidenceSubmitPayload } from '@/features/evidence-submit/ui/evidence-modal';

interface UseRoomEvidenceStateParams {
  room: RoomDetail | null;
  currentParticipant: Participant | null;
  currentUserId: string | null;
}

interface UseRoomEvidenceStateResult {
  evidenceGroups: RoomDetail['evidenceGroups'];
  hasSubmittedEvidence: boolean;
  isEvidenceDisabled: boolean;
  handleEvidenceSubmit: (payload: EvidenceSubmitPayload) => Promise<void>;
}

function useRoomEvidenceState({
  room,
  currentParticipant,
  currentUserId,
}: UseRoomEvidenceStateParams): UseRoomEvidenceStateResult {
  const queryClient = useQueryClient();
  const roomId = room?.id ?? null;

  const applyEvidenceGroups = useCallback(
    (nextGroups: RoomDetail['evidenceGroups']) => {
      if (!roomId) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) =>
          previous
            ? ({
                ...previous,
                evidenceGroups: nextGroups,
              } satisfies RoomDetail)
            : previous,
      );
    },
    [queryClient, roomId],
  );

  const { submitEvidence } = useEvidenceMutation({
    roomId,
    onSuccess: (response) => applyEvidenceGroups(response.evidenceGroups),
  });

  const hasSubmittedEvidence = useMemo(() => {
    if (!currentUserId) {
      return false;
    }

    const groups = room?.evidenceGroups ?? [];

    return groups.some((group) =>
      group.submissions.some((submission) => submission.author.id === currentUserId),
    );
  }, [currentUserId, room?.evidenceGroups]);

  const isEvidenceDisabled = !currentParticipant?.factionId || hasSubmittedEvidence;

  const handleEvidenceSubmit = useCallback(
    async (payload: EvidenceSubmitPayload) => {
      if (!room || !currentParticipant) {
        throw new Error('증거를 제출할 수 있는 참가자 정보를 찾을 수 없습니다.');
      }

      await submitEvidence({
        factionId: payload.factionId,
        authorId: currentParticipant.id,
        summary: payload.summary,
        body: payload.body,
        images: payload.images,
      });
    },
    [currentParticipant, room, submitEvidence],
  );

  return {
    evidenceGroups: room?.evidenceGroups ?? [],
    hasSubmittedEvidence,
    isEvidenceDisabled,
    handleEvidenceSubmit,
  };
}

export type { UseRoomEvidenceStateParams, UseRoomEvidenceStateResult };
export { useRoomEvidenceState };
