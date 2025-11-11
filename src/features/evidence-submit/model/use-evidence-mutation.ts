import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import type { PostRoomEvidenceResponse } from '@/features/evidence-submit/api/post-room-evidence';
import { postRoomEvidence } from '@/features/evidence-submit/api/post-room-evidence';
import { resolveHttpErrorMessage } from '@/shared/lib/http/resolve-http-error-message';
import { logDebug } from '@/shared/lib/logger';

const EVIDENCE_SUCCESS_MESSAGE = '증거가 제출되었어요.';
const EVIDENCE_FAILURE_MESSAGE = '증거 제출에 실패했어요. 잠시 후 다시 시도해 주세요.';

interface UseEvidenceMutationOptions {
  roomId: string | null | undefined;
  onSuccess?: (response: PostRoomEvidenceResponse) => void;
}

interface EvidenceMutationVariables {
  factionId: string;
  authorId: string;
  summary: string;
  body: string;
  images: File[];
}

function useEvidenceMutation({ roomId, onSuccess }: UseEvidenceMutationOptions) {
  const mutation = useMutation({
    mutationFn: async (variables: EvidenceMutationVariables) => {
      if (!roomId) {
        throw new Error('roomId가 필요합니다.');
      }

      return postRoomEvidence({
        roomId,
        factionId: variables.factionId,
        authorId: variables.authorId,
        summary: variables.summary,
        body: variables.body,
        images: variables.images.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      });
    },
    onSuccess: (response) => {
      toast.success(response.message ?? EVIDENCE_SUCCESS_MESSAGE);
      onSuccess?.(response);
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        const resolved = await resolveHttpErrorMessage(error, {
          namespace: 'EvidenceSubmit',
          parseErrorLogMessage: '증거 제출 오류 응답 파싱 실패',
        });
        toast.error(resolved ?? EVIDENCE_FAILURE_MESSAGE);
        return;
      }

      logDebug('EvidenceSubmit', '예기치 못한 오류로 증거 제출에 실패했어요.', error);
      toast.error(EVIDENCE_FAILURE_MESSAGE);
    },
  });

  return {
    submitEvidence: mutation.mutateAsync,
    isSubmittingEvidence: mutation.isPending,
  };
}

export type { EvidenceMutationVariables };
export { useEvidenceMutation };
