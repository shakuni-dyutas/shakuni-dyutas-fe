import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  handleBetPlaced: () => void;
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
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const lastRoomIdRef = useRef<string | null>(roomId);

  useEffect(() => {
    if (lastRoomIdRef.current === roomId) {
      return;
    }
    setHasPlacedBet(false);
    lastRoomIdRef.current = roomId;
  }, [roomId]);

  const betting = useMemo<RoomBettingSnapshot | null>(() => {
    if (!room) {
      return null;
    }

    const colorizedFactions = room.betting.factions.map((faction, index) => ({
      ...faction,
      color: faction.color ?? factionColorMap[faction.id] ?? getRoomFactionColor(index),
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

  const handleBetPlaced = useCallback(() => {
    setHasPlacedBet(true);
  }, []);

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

      queryClient.setQueryData(ROOM_QUERY_KEYS.betting(roomId), { betting: nextBetting });
      if (nextParticipants) {
        queryClient.setQueryData(ROOM_QUERY_KEYS.participants(roomId), {
          participants: nextParticipants,
        });
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
    handleBetPlaced,
    applyBettingSnapshot,
  };
}

export type { UseRoomBettingStateParams, UseRoomBettingStateResult };
export { useRoomBettingState };
