import { useMemo } from 'react';

import type { RoomDetail, RoomMeta } from '@/entities/room/types/room-detail';
import { assignFactionColors } from '@/widgets/room-shell/model/assign-faction-colors';

interface UseRoomMetaStateResult {
  meta: RoomMeta | null;
  factionColorMap: Record<string, string>;
}

function useRoomMetaState(room: RoomDetail | null): UseRoomMetaStateResult {
  return useMemo(() => {
    if (!room) {
      return {
        meta: null,
        factionColorMap: {},
      };
    }

    const { colorized, colorMap } = assignFactionColors(room.factionInfos);

    const {
      participants: _participants,
      betting: _betting,
      evidenceGroups: _evidenceGroups,
      chatMessages: _chatMessages,
      ...restMeta
    } = room;

    return {
      meta: {
        ...restMeta,
        factionInfos: colorized,
      },
      factionColorMap: colorMap,
    };
  }, [room]);
}

export type { UseRoomMetaStateResult };
export { useRoomMetaState };
