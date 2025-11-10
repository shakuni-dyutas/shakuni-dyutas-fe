'use client';

import { useMemo } from 'react';

import { useRoomDetail } from '@/entities/room/model/use-room-detail';
import { Button } from '@/shared/ui/button';
import { RoomShell } from '@/widgets/room-shell/ui/room-shell';

interface RoomDetailPageProps {
  roomId: string;
}

function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  const { data: room, isLoading, isError, refetch, error } = useRoomDetail(roomId);

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return '알 수 없는 오류가 발생했습니다.';
  }, [error]);

  if (isError) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl">방 정보를 불러오지 못했어요.</h1>
          {errorMessage ? <p className="text-muted-foreground text-sm">{errorMessage}</p> : null}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>다시 시도</Button>
        </div>
      </section>
    );
  }

  return <RoomShell room={room ?? null} isLoading={isLoading} onRetry={() => refetch()} />;
}

export { RoomDetailPage };
export type { RoomDetailPageProps };
