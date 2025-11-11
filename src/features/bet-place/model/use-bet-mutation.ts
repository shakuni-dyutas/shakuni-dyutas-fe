'use client';

import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import { type PostRoomBetResponse, postRoomBet } from '@/features/bet-place/api/post-room-bet';
import { resolveHttpErrorMessage } from '@/shared/lib/http/resolve-http-error-message';
import { logDebug } from '@/shared/lib/logger';

const BET_SUCCESS_MESSAGE = '배팅이 완료되었어요.';
const BET_FAILURE_MESSAGE = '배팅에 실패했어요. 잠시 후 다시 시도해 주세요.';

interface UseBetMutationOptions {
  roomId: string;
  onSuccess?: (response: PostRoomBetResponse) => void;
}

interface BetMutationVariables {
  factionId: string;
  points: number;
}

function useBetMutation({ roomId, onSuccess }: UseBetMutationOptions) {
  const mutation = useMutation({
    mutationFn: (variables: BetMutationVariables) => postRoomBet({ roomId, ...variables }),
    onSuccess: async (response) => {
      toast.success(response.message ?? BET_SUCCESS_MESSAGE);
      onSuccess?.(response);
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        const resolved = await resolveHttpErrorMessage(error, {
          namespace: 'BetPlace',
          parseErrorLogMessage: '배팅 오류 응답 파싱 실패',
        });
        toast.error(resolved ?? BET_FAILURE_MESSAGE);
        return;
      }

      logDebug('BetPlace', '예기치 못한 오류로 배팅에 실패했어요.', error);
      toast.error(BET_FAILURE_MESSAGE);
    },
  });

  return {
    submitBet: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
}

export type { BetMutationVariables };
export { useBetMutation };
