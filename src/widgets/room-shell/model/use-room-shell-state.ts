import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { ParticipantProfile } from '@/entities/participant/types/participant';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type { RoomChatState, RoomDetail } from '@/entities/room/types/room-detail';
import { useSessionStore } from '@/entities/session/model/session-store';
import { TEAM_FACTION_NONE_ID } from '@/entities/team/config/constants';
import type { TeamFactionId } from '@/entities/team/types/team-faction';
import { useChatMutation } from '@/features/chat-send/model/use-chat-mutation';
import { useEvidenceMutation } from '@/features/evidence-submit/model/use-evidence-mutation';
import type { EvidenceSubmitPayload } from '@/features/evidence-submit/ui/evidence-modal';

interface UseRoomShellStateParams {
  room: RoomDetail | null;
}

interface UseRoomShellStateResult {
  roomData: RoomDetail | null;
  currentUserId: string | null;
  currentFaction: RoomDetail['factions'][number] | null;
  hasSubmittedEvidence: boolean;
  isEvidenceDisabled: boolean;
  hasPlacedBet: boolean;
  handleBetPlaced: () => void;
  handleEvidenceSubmit: (payload: EvidenceSubmitPayload) => Promise<void>;
  handleChatSubmit: (message: string) => void;
}

function useRoomShellState({ room }: UseRoomShellStateParams): UseRoomShellStateResult {
  const queryClient = useQueryClient();
  const sessionUser = useSessionStore((state) => state.user);
  const currentUserId = sessionUser?.id ?? null;
  const [localEvidenceGroups, setLocalEvidenceGroups] = useState(room?.evidenceGroups ?? []);
  const [localChatMessages, setLocalChatMessages] = useState(room?.chatMessages ?? []);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const previousRoomIdRef = useRef<string | null>(room?.id ?? null);

  useEffect(() => {
    if (!room) {
      setLocalEvidenceGroups([]);
      setLocalChatMessages([]);
      setHasPlacedBet(false);
      previousRoomIdRef.current = null;
      return;
    }

    setLocalEvidenceGroups(room.evidenceGroups);
    setLocalChatMessages(room.chatMessages);
    if (previousRoomIdRef.current !== room.id) {
      setHasPlacedBet(false);
      previousRoomIdRef.current = room.id;
    }
  }, [room]);

  const roomData = useMemo(() => {
    if (!room) {
      return null;
    }

    return {
      ...room,
      evidenceGroups: localEvidenceGroups,
      chatMessages: localChatMessages,
    } satisfies RoomDetail;
  }, [room, localChatMessages, localEvidenceGroups]);

  const currentParticipant = useMemo(() => {
    if (!room || !currentUserId) {
      return null;
    }

    return room.participants.find((participant) => participant.id === currentUserId) ?? null;
  }, [currentUserId, room]);

  const currentFaction = useMemo(() => {
    if (!room || !currentParticipant) {
      return null;
    }

    return room.factions.find((faction) => faction.id === currentParticipant.factionId) ?? null;
  }, [currentParticipant, room]);

  const hasSubmittedEvidence = useMemo(() => {
    if (!currentUserId) {
      return false;
    }

    return localEvidenceGroups.some((group) =>
      group.submissions.some((submission) => submission.author.id === currentUserId),
    );
  }, [currentUserId, localEvidenceGroups]);

  const isEvidenceDisabled = !currentFaction || hasSubmittedEvidence;

  const roomId = room?.id ?? null;

  const handleEvidenceMutationSuccess = useCallback(
    (nextGroups: RoomDetail['evidenceGroups']) => {
      setLocalEvidenceGroups(nextGroups);
      if (roomId) {
        queryClient.setQueryData(ROOM_QUERY_KEYS.evidence(roomId), { evidenceGroups: nextGroups });
      }
    },
    [queryClient, roomId],
  );

  const { submitEvidence } = useEvidenceMutation({
    roomId,
    onSuccess: (response) => handleEvidenceMutationSuccess(response.evidenceGroups),
  });

  const syncChatQuery = useCallback(
    (updater: (messages: ChatMessage[]) => ChatMessage[]) => {
      if (!roomId) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.chat(roomId),
        (previousState: RoomChatState | undefined): RoomChatState => {
          const currentMessages = previousState?.chatMessages ?? [];
          return {
            chatMessages: updater(currentMessages),
          } satisfies RoomChatState;
        },
      );
    },
    [queryClient, roomId],
  );

  const { submitChat } = useChatMutation();

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

  const handleChatSubmit = useCallback(
    (message: string) => {
      if (!room) {
        return;
      }

      const authorProfile: ParticipantProfile = currentParticipant
        ? {
            id: currentParticipant.id,
            nickname: currentParticipant.nickname,
            avatarUrl: currentParticipant.avatarUrl,
          }
        : sessionUser
          ? {
              id: sessionUser.id,
              nickname: sessionUser.nickname,
              avatarUrl: sessionUser.profileImageUrl ?? undefined,
            }
          : {
              id: TEAM_FACTION_NONE_ID,
              nickname: '알 수 없음',
              avatarUrl: undefined,
            };

      const factionId: TeamFactionId = currentParticipant?.factionId ?? TEAM_FACTION_NONE_ID;
      const optimisticId = generateTempId();
      const optimisticMessage: ChatMessage = {
        id: optimisticId,
        roomId: room.id,
        factionId,
        author: authorProfile,
        body: message,
        createdAt: new Date().toISOString(),
      };

      setLocalChatMessages((prev) => [optimisticMessage, ...prev]);
      syncChatQuery((prev) => [optimisticMessage, ...prev]);

      void submitChat({
        roomId: room.id,
        authorId: authorProfile.id,
        factionId,
        body: message,
      })
        .then((response) => {
          setLocalChatMessages((prev) => replaceChatMessage(prev, optimisticId, response.message));
          syncChatQuery((prev) => replaceChatMessage(prev, optimisticId, response.message));
        })
        .catch(() => {
          setLocalChatMessages((prev) => prev.filter((chat) => chat.id !== optimisticId));
          syncChatQuery((prev) => prev.filter((chat) => chat.id !== optimisticId));
        });
    },
    [currentParticipant, room, sessionUser, submitChat, syncChatQuery],
  );

  const handleBetPlaced = useCallback(() => {
    setHasPlacedBet(true);
  }, []);

  return {
    roomData,
    currentUserId,
    currentFaction,
    hasSubmittedEvidence,
    isEvidenceDisabled,
    hasPlacedBet,
    handleBetPlaced,
    handleEvidenceSubmit,
    handleChatSubmit,
  };
}

function generateTempId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export type { UseRoomShellStateParams, UseRoomShellStateResult };
export { useRoomShellState };

function replaceChatMessage(messages: ChatMessage[], targetId: string, nextMessage: ChatMessage) {
  const hasTarget = messages.some((message) => message.id === targetId);

  if (!hasTarget) {
    return [nextMessage, ...messages];
  }

  return messages.map((message) => (message.id === targetId ? nextMessage : message));
}
