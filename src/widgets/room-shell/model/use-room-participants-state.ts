import { useMemo } from 'react';

import type { Participant } from '@/entities/participant/types/participant';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { useSessionStore } from '@/entities/session/model/session-store';

interface UseRoomParticipantsStateResult {
  participants: Participant[] | null;
  currentUserId: string | null;
  currentParticipant: Participant | null;
}

function useRoomParticipantsState(room: RoomDetail | null): UseRoomParticipantsStateResult {
  const sessionUser = useSessionStore((state) => state.user);
  const currentUserId = sessionUser?.id ?? null;

  const participants = room?.participants ?? null;
  const currentParticipant = useMemo(() => {
    if (!participants || !currentUserId) {
      return null;
    }

    return participants.find((participant) => participant.id === currentUserId) ?? null;
  }, [currentUserId, participants]);

  return {
    participants,
    currentUserId,
    currentParticipant,
  };
}

export type { UseRoomParticipantsStateResult };
export { useRoomParticipantsState };
