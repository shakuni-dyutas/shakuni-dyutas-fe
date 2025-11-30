'use client';

import { useRouter } from 'next/navigation';

import { useRoomResult } from '@/entities/room/model/use-room-result';
import { Button } from '@/shared/ui/button';

import { RoomResultPage } from './room-result-page';

interface RoomResultRouteProps {
  roomId: string;
}

function RoomResultRoute({ roomId }: RoomResultRouteProps) {
  const router = useRouter();
  const { data: result, isLoading, error } = useRoomResult({ roomId });

  const handleBackToLobby = () => {
    router.push('/');
  };

  const handleCreateNewRoom = () => {
    router.push('/rooms/create');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 font-semibold text-lg">결과를 불러올 수 없습니다</p>
          <p className="mb-6 text-muted-foreground text-sm">
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
          <Button onClick={handleBackToLobby}>로비로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <RoomResultPage
      result={result}
      onBackToLobby={handleBackToLobby}
      onCreateNewRoom={handleCreateNewRoom}
    />
  );
}

export { RoomResultRoute };
export type { RoomResultRouteProps };
