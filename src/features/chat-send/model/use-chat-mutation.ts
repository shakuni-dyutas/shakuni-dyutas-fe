import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';

import { type PostRoomChatResponse, postRoomChat } from '@/features/chat-send/api/post-room-chat';
import { resolveHttpErrorMessage } from '@/shared/lib/http/resolve-http-error-message';
import { logDebug } from '@/shared/lib/logger';

const CHAT_FAILURE_MESSAGE = '메시지 전송에 실패했어요. 잠시 후 다시 시도해 주세요.';

interface UseChatMutationOptions {
  onSuccess?: (response: PostRoomChatResponse, variables: ChatMutationVariables) => void;
  onError?: (error: unknown, variables: ChatMutationVariables) => void;
}

interface ChatMutationVariables {
  roomId: string;
  authorId: string;
  factionId: string;
  body: string;
}

function useChatMutation({ onSuccess, onError }: UseChatMutationOptions = {}) {
  const mutation = useMutation({
    mutationFn: (variables: ChatMutationVariables) => postRoomChat(variables),
    onSuccess: (response, variables) => {
      if (response.notice) {
        toast.success(response.notice);
      }
      onSuccess?.(response, variables);
    },
    onError: async (error, variables) => {
      onError?.(error, variables);

      if (error instanceof HTTPError) {
        const resolved = await resolveHttpErrorMessage(error, {
          namespace: 'ChatSend',
          parseErrorLogMessage: '채팅 전송 오류 응답 파싱 실패',
        });
        toast.error(resolved ?? CHAT_FAILURE_MESSAGE);
        return;
      }

      logDebug('ChatSend', '예기치 못한 오류로 채팅 전송에 실패했어요.', error);
      toast.error(CHAT_FAILURE_MESSAGE);
    },
  });

  return {
    submitChat: mutation.mutateAsync,
    isSubmittingChat: mutation.isPending,
  };
}

export type { ChatMutationVariables };
export { useChatMutation };
