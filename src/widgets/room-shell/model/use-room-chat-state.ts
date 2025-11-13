import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { Participant, ParticipantProfile } from '@/entities/participant/types/participant';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type { RoomChatState, RoomDetail } from '@/entities/room/types/room-detail';
import type { SessionUser } from '@/entities/session/model/session-store';
import { useSessionStore } from '@/entities/session/model/session-store';
import { TEAM_FACTION_NONE_ID } from '@/entities/team/config/constants';
import { useChatMutation } from '@/features/chat-send/model/use-chat-mutation';

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

  const applyChatUpdate = useCallback(
    (updater: (messages: ChatMessage[]) => ChatMessage[]) => {
      if (!roomId) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.chat(roomId),
        (previousState: RoomChatState | undefined): RoomChatState => {
          const currentMessages = previousState?.chatMessages ?? [];
          return { chatMessages: updater(currentMessages) };
        },
      );

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) => {
          if (!previous) {
            return previous;
          }
          return {
            ...previous,
            chatMessages: updater(previous.chatMessages ?? []),
          };
        },
      );
    },
    [queryClient, roomId],
  );

  const { submitChat } = useChatMutation();

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

      const prependOptimistic = (messages: ChatMessage[]) => [optimisticMessage, ...messages];
      applyChatUpdate(prependOptimistic);

      try {
        const response = await submitChat({
          roomId,
          authorId: authorProfile.id,
          factionId,
          body: message,
        });

        const replaceWithServerMessage = (messages: ChatMessage[]) =>
          replaceChatMessage(messages, optimisticId, response.message);

        applyChatUpdate(replaceWithServerMessage);
      } catch {
        const removeOptimistic = (messages: ChatMessage[]) =>
          messages.filter((chat) => chat.id !== optimisticId);
        applyChatUpdate(removeOptimistic);
      }
    },
    [applyChatUpdate, currentParticipant, room, roomId, sessionUser, submitChat],
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

function replaceChatMessage(messages: ChatMessage[], targetId: string, nextMessage: ChatMessage) {
  const filtered = messages.filter(
    (message) => message.id !== targetId && message.id !== nextMessage.id,
  );

  return [nextMessage, ...filtered];
}

export type { UseRoomChatStateParams, UseRoomChatStateResult };
export { useRoomChatState };
