import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRoomEvents } from '@/entities/room/model/use-room-events';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import type { RoomServerEvent } from '@/entities/room/types/room-event';
import { ROUTE_PATHS } from '@/shared/config/constants';

type RoomEndingPayload = Extract<RoomServerEvent, { type: 'room-ending' }>['data'];
type RoomEndedPayload = Extract<RoomServerEvent, { type: 'room-ended' }>['data'];

function useRoomEndFlow(roomId: string | null, roomDetail?: RoomDetail | null) {
  const router = useRouter();
  const [endingNotice, setEndingNotice] = useState<RoomEndingPayload | null>(null);
  const [endedInfo, setEndedInfo] = useState<RoomEndedPayload | null>(null);

  useEffect(() => {
    // roomId 변화 시 종료 관련 상태를 초기화해 새 방 진입에 대비
    if (!roomId) {
      setEndingNotice(null);
      setEndedInfo(null);
      return;
    }
    setEndingNotice(null);
    setEndedInfo(null);
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !roomDetail) {
      return;
    }

    const hasEnded = Boolean(roomDetail.endedAt ?? roomDetail.ended);
    if (!hasEnded) {
      return;
    }

    setEndedInfo(
      (previous) =>
        previous ?? {
          roomId: roomDetail.id,
          resultPath: ROUTE_PATHS.ROOM_RESULT(roomDetail.id),
        },
    );
  }, [roomDetail, roomId]);

  const handleRoomEnding = useCallback((data: RoomEndingPayload) => {
    setEndingNotice(data);
    toast.info('게임이 곧 종료됩니다.', {
      description: `종료 예정 시각: ${new Date(data.endsAt).toLocaleString()}`,
      duration: 5000,
    });
  }, []);

  const handleRoomEnded = useCallback((data: RoomEndedPayload) => {
    setEndedInfo(data);
    toast.success('게임이 종료되었어요.', {
      description: '결과를 확인해 주세요.',
      duration: 5000,
    });
  }, []);

  useRoomEvents(roomId, {
    onRoomEnding: handleRoomEnding,
    onRoomEnded: handleRoomEnded,
  });

  const handleViewResult = () => {
    if (!endedInfo) {
      return;
    }
    const nextPath = endedInfo.resultPath ?? ROUTE_PATHS.ROOM_RESULT(endedInfo.roomId);
    router.replace(nextPath);
  };

  return {
    endingNotice,
    endedInfo,
    handleViewResult,
  };
}

export { useRoomEndFlow };
export type { RoomEndingPayload, RoomEndedPayload };
