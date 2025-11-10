import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { ParticipantProfile } from '@/entities/participant/types/participant';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { useSessionStore } from '@/entities/session/model/session-store';
import { TEAM_FACTION_NONE_ID } from '@/entities/team/config/constants';
import type { TeamFactionId } from '@/entities/team/types/team-faction';
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
  handleEvidenceSubmit: (payload: EvidenceSubmitPayload) => Promise<void>;
  handleChatSubmit: (message: string) => void;
}

function useRoomShellState({ room }: UseRoomShellStateParams): UseRoomShellStateResult {
  const sessionUser = useSessionStore((state) => state.user);
  const currentUserId = sessionUser?.id ?? null;
  const [localEvidenceGroups, setLocalEvidenceGroups] = useState(room?.evidenceGroups ?? []);
  const [localChatMessages, setLocalChatMessages] = useState(room?.chatMessages ?? []);

  useEffect(() => {
    if (!room) {
      setLocalEvidenceGroups([]);
      setLocalChatMessages([]);
      return;
    }

    setLocalEvidenceGroups(room.evidenceGroups);
    setLocalChatMessages(room.chatMessages);
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

  const handleEvidenceSubmit = useCallback(
    async (payload: EvidenceSubmitPayload) => {
      if (!room || !currentParticipant) {
        return;
      }

      const submissionId = generateTempId();
      const newSubmission: EvidenceItem = {
        id: submissionId,
        roomId: room.id,
        factionId: payload.factionId,
        author: currentParticipant,
        summary: payload.summary,
        body: payload.body,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        media: payload.images.map((file, index) => ({
          id: `${submissionId}-media-${index}`,
          type: 'image',
          url: `local:${file.name}`,
          sizeInBytes: file.size,
        })),
      };

      setLocalEvidenceGroups((prev) => {
        const factionName =
          room.factions.find((faction) => faction.id === payload.factionId)?.name ?? '내 진영';

        const nextGroups = prev.some((group) => group.factionId === payload.factionId)
          ? prev.map((group) =>
              group.factionId === payload.factionId
                ? { ...group, submissions: [newSubmission, ...group.submissions] }
                : group,
            )
          : [
              ...prev,
              {
                factionId: payload.factionId,
                factionName,
                submissions: [newSubmission],
              },
            ];

        return nextGroups;
      });
    },
    [currentParticipant, room],
  );

  const handleChatSubmit = useCallback(
    (message: string) => {
      // TODO: 현재 세션에 유저 정보가 없는 상태임. 세션 API가 복구되면 아래 조건으로 되돌리고,
      // room 참가자/세션 사용자 정보를 서버 응답과 동기화한다.
      // if (!room || !sessionUser) {
      //   return;
      // }
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

      const newMessage: ChatMessage = {
        id: generateTempId(),
        roomId: room.id,
        factionId,
        author: authorProfile,
        body: message,
        createdAt: new Date().toISOString(),
      };

      setLocalChatMessages((prev) => [newMessage, ...prev]);
    },
    [currentParticipant, room, sessionUser],
  );

  return {
    roomData,
    currentUserId,
    currentFaction,
    hasSubmittedEvidence,
    isEvidenceDisabled,
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
