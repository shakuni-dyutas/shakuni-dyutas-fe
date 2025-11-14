import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { Participant, ParticipantProfile } from '@/entities/participant/types/participant';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import type { SessionUser } from '@/entities/session/model/session-store';
import { useSessionStore } from '@/entities/session/model/session-store';
import { TEAM_FACTION_NONE_ID } from '@/entities/team/config/constants';
import { postRoomChat } from '@/features/chat-send/api/post-room-chat';
import type { ChatMutationVariables } from '@/features/chat-send/model/use-chat-mutation';
import { resolveHttpErrorMessage } from '@/shared/lib/http/resolve-http-error-message';
import { logDebug } from '@/shared/lib/logger';

interface UseRoomChatStateParams {
  room: RoomDetail | null;
  currentParticipant: Participant | null;
}

interface UseRoomChatStateResult {
  chatMessages: RoomDetail['chatMessages'];
  handleChatSubmit: (message: string) => void;
}

function useRoomChatState({
  room,
  currentParticipant,
}: UseRoomChatStateParams): UseRoomChatStateResult {
  const sessionUser = useSessionStore((state) => state.user);
  const queryClient = useQueryClient();
  const roomId = room?.id ?? null;
  const chatMessages = useMemo(() => room?.chatMessages ?? [], [room?.chatMessages]);

  const chatMutation = useMutation<
    Awaited<ReturnType<typeof postRoomChat>>,
    unknown,
    ChatMutationVariables & { optimistic: ChatMessage },
    { previousDetail?: RoomDetail; optimisticId?: string }
  >({
    mutationFn: async (variables) => {
      const { optimistic: _optimistic, ...rest } = variables;
      return postRoomChat(rest);
    },
    onMutate: async (variables) => {
      if (!roomId) {
        return;
      }

      await queryClient.cancelQueries({ queryKey: ROOM_QUERY_KEYS.detail(roomId) });
      const previousDetail = queryClient.getQueryData<RoomDetail>(ROOM_QUERY_KEYS.detail(roomId));

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => {
          if (!previous) {
            return previous;
          }
          return {
            ...previous,
            chatMessages: [
              variables.optimistic,
              ...previous.chatMessages.filter((message) => message.id !== variables.optimistic.id),
            ],
          };
        },
      );

      return { previousDetail, optimisticId: variables.optimistic.id };
    },
    onError: async (error, _variables, context) => {
      if (!roomId || !context?.previousDetail) {
        // no optimistic update applied
      } else {
        queryClient.setQueryData(ROOM_QUERY_KEYS.detail(roomId), context.previousDetail);
      }

      if (error instanceof HTTPError) {
        const resolved = await resolveHttpErrorMessage(error, {
          namespace: 'ChatSend',
          parseErrorLogMessage: '채팅 전송 오류 응답 파싱 실패',
        });
        toast.error(resolved ?? '메시지 전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
        return;
      }

      logDebug('ChatSend', '예기치 못한 오류로 채팅 전송에 실패했어요.', error);
      toast.error('메시지 전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
    },
    onSuccess: (response, variables, context) => {
      if (!roomId) {
        return;
      }

      if (response.notice) {
        toast.success(response.notice);
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            chatMessages: [
              response.message,
              ...previous.chatMessages.filter(
                (message) =>
                  message.id !== response.message.id && message.id !== context?.optimisticId,
              ),
            ],
          };
        },
      );
    },
    onSettled: () => {
      if (!roomId) {
        return;
      }
      void queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.detail(roomId) });
    },
  });

  const handleChatSubmit = useCallback(
    async (message: string) => {
      if (!room || !roomId) {
        return;
      }

      const { profile: authorProfile, factionId } = resolveAuthorProfile(
        currentParticipant,
        sessionUser,
      );
      const optimisticId = generateTempId();
      const optimisticMessage: ChatMessage = {
        id: optimisticId,
        roomId: room.id,
        factionId,
        author: authorProfile,
        body: message,
        createdAt: new Date().toISOString(),
      };

      await chatMutation.mutateAsync({
        roomId,
        authorId: authorProfile.id,
        factionId,
        body: message,
        optimistic: optimisticMessage,
      });
    },
    [chatMutation, currentParticipant, room, roomId, sessionUser],
  );

  return {
    chatMessages,
    handleChatSubmit,
  };
}

function resolveAuthorProfile(
  currentParticipant: Participant | null,
  sessionUser: SessionUser | null,
) {
  if (currentParticipant) {
    return {
      profile: {
        id: currentParticipant.id,
        nickname: currentParticipant.nickname,
        avatarUrl: currentParticipant.avatarUrl,
      } satisfies ParticipantProfile,
      factionId: currentParticipant.factionId,
    };
  }

  if (sessionUser) {
    return {
      profile: {
        id: sessionUser.id,
        nickname: sessionUser.nickname,
        avatarUrl: sessionUser.profileImageUrl ?? undefined,
      },
      factionId: TEAM_FACTION_NONE_ID,
    };
  }

  return {
    profile: {
      id: TEAM_FACTION_NONE_ID,
      nickname: '알 수 없음',
      avatarUrl: undefined,
    },
    factionId: TEAM_FACTION_NONE_ID,
  };
}

function generateTempId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export type { UseRoomChatStateParams, UseRoomChatStateResult };
export { useRoomChatState };
