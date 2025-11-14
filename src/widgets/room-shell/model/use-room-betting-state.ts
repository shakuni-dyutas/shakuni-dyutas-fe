import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import type { Participant } from '@/entities/participant/types/participant';
import { getRoomFactionColor } from '@/entities/room/config/constants';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import type {
  RoomBettingSnapshot,
  RoomDetail,
  RoomFactionSnapshot,
} from '@/entities/room/types/room-detail';

interface UseRoomBettingStateParams {
  room: RoomDetail | null;
  factionColorMap: Record<string, string>;
  currentParticipant: Participant | null;
}

interface UseRoomBettingStateResult {
  betting: RoomBettingSnapshot | null;
  currentFaction: RoomFactionSnapshot | null;
  hasPlacedBet: boolean;
  applyBettingSnapshot: (options: {
    betting: RoomBettingSnapshot;
    participants?: Participant[];
  }) => void;
}

function useRoomBettingState({
  room,
  factionColorMap,
  currentParticipant,
}: UseRoomBettingStateParams): UseRoomBettingStateResult {
  const queryClient = useQueryClient();
  const roomId = room?.id ?? null;

  const betting = useMemo<RoomBettingSnapshot | null>(() => {
    if (!room) {
      return null;
    }

    const colorizedFactions = room.betting.factions.map((faction, index) => ({
      ...faction,
      color: factionColorMap[faction.id] ?? getRoomFactionColor(index),
    }));

    return {
      ...room.betting,
      factions: colorizedFactions,
    };
  }, [factionColorMap, room]);

  const currentFaction = useMemo(() => {
    if (!betting || !currentParticipant) {
      return null;
    }

    return betting.factions.find((faction) => faction.id === currentParticipant.factionId) ?? null;
  }, [betting, currentParticipant]);

  const hasPlacedBet = currentParticipant ? currentParticipant.totalBetPoints > 0 : false;

  const applyBettingSnapshot = useCallback(
    ({
      betting: nextBetting,
      participants: nextParticipants,
    }: {
      betting: RoomBettingSnapshot;
      participants?: Participant[];
    }) => {
      if (!roomId) {
        return;
      }

      queryClient.setQueryData(
        ROOM_QUERY_KEYS.detail(roomId),
        (previous: RoomDetail | undefined) =>
          previous
            ? ({
                ...previous,
                betting: nextBetting,
                participants: nextParticipants ?? previous.participants,
              } satisfies RoomDetail)
            : previous,
      );
    },
    [queryClient, roomId],
  );

  return {
    betting,
    currentFaction,
    hasPlacedBet,
    applyBettingSnapshot,
  };
}

export type { UseRoomBettingStateParams, UseRoomBettingStateResult };
export { useRoomBettingState };
