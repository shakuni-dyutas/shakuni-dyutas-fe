'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { ROOM_CHAT_CONSTRAINTS } from '@/entities/room/config/constants';
import { ROOM_QUERY_KEYS } from '@/entities/room/model/room-query-keys';
import { useRoomBetting } from '@/entities/room/model/use-room-betting';
import { useRoomChat } from '@/entities/room/model/use-room-chat';
import { useRoomEvents } from '@/entities/room/model/use-room-events';
import { useRoomEvidence } from '@/entities/room/model/use-room-evidence';
import { useRoomMeta } from '@/entities/room/model/use-room-meta';
import { useRoomParticipants } from '@/entities/room/model/use-room-participants';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { openBetModal } from '@/features/bet-place/ui/bet-modal';
import { openEvidenceModal } from '@/features/evidence-submit/ui/evidence-modal';
import { Button } from '@/shared/ui/button';
import { useRoomShellState } from '@/widgets/room-shell/model/use-room-shell-state';
import { ChatCard } from '@/widgets/room-shell/ui/chat-card';
import { EvidenceSection } from '@/widgets/room-shell/ui/evidence-section';
import { ParticipantsPanel } from '@/widgets/room-shell/ui/participants-panel';
import { RoomFooterBar } from '@/widgets/room-shell/ui/room-footer-bar';
import { RoomShellSkeleton } from '@/widgets/room-shell/ui/room-shell-skeleton';
import { RoomSummaryBar } from '@/widgets/room-shell/ui/room-summary-bar';

interface RoomShellProps {
  roomId: string;
}

function RoomShell({ roomId }: RoomShellProps) {
  const queryClient = useQueryClient();
  const metaQuery = useRoomMeta(roomId);
  const participantsQuery = useRoomParticipants(roomId);
  const bettingQuery = useRoomBetting(roomId);
  const evidenceQuery = useRoomEvidence(roomId);
  const chatQuery = useRoomChat(roomId);
  useRoomEvents(roomId);

  const queries = [metaQuery, participantsQuery, bettingQuery, evidenceQuery, chatQuery] as const;

  const room = useMemo<RoomDetail | null>(() => {
    if (
      !metaQuery.data ||
      !participantsQuery.data ||
      !bettingQuery.data ||
      !evidenceQuery.data ||
      !chatQuery.data
    ) {
      return null;
    }

    return {
      ...metaQuery.data,
      ...participantsQuery.data,
      ...bettingQuery.data,
      ...evidenceQuery.data,
      ...chatQuery.data,
    };
  }, [
    bettingQuery.data,
    chatQuery.data,
    evidenceQuery.data,
    metaQuery.data,
    participantsQuery.data,
  ]);

  const isInitialLoading =
    !room && queries.some((query) => query.isLoading || query.isPending || query.isFetching);
  const blockingError = !room ? queries.find((query) => query.isError)?.error : null;
  const errorMessage =
    blockingError instanceof Error
      ? blockingError.message
      : blockingError
        ? '알 수 없는 오류가 발생했습니다.'
        : null;

  const handleRetry = () => {
    queries.forEach((query) => {
      query.refetch();
    });
  };

  const {
    roomData,
    currentUserId,
    currentFaction,
    hasSubmittedEvidence,
    isEvidenceDisabled,
    hasPlacedBet,
    handleBetPlaced,
    handleEvidenceSubmit,
    handleChatSubmit,
  } = useRoomShellState({ room });

  if (isInitialLoading && !roomData) {
    return <RoomShellSkeleton />;
  }

  if (!roomData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/10 px-4 text-center">
        <div className="space-y-2">
          <p className="font-semibold text-xl">방 정보를 불러오지 못했어요.</p>
          <p className="text-muted-foreground text-sm">
            {errorMessage ?? '잠시 후 다시 시도하거나 홈으로 이동해 주세요.'}
          </p>
        </div>
        <Button onClick={handleRetry}>다시 시도</Button>
      </div>
    );
  }

  const handleOpenBetModal = () => {
    openBetModal({
      roomId: roomData.id,
      roomTitle: roomData.title,
      factions: roomData.factions,
      betting: roomData.betting,
      onSuccess: (response) => {
        handleBetPlaced();
        if (response.participants) {
          queryClient.setQueryData(ROOM_QUERY_KEYS.participants(roomId), {
            participants: response.participants,
          });
        }
        void Promise.all([
          queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.betting(roomId) }),
          queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.meta(roomId) }),
          queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.participants(roomId) }),
        ]);
      },
    }).catch(() => {});
  };

  const handleOpenEvidenceModal = () => {
    openEvidenceModal({
      roomTitle: roomData.title,
      faction: currentFaction,
      hasSubmitted: hasSubmittedEvidence,
      onSubmit: handleEvidenceSubmit,
    }).catch(() => {});
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-40">
      <RoomSummaryBar room={roomData} />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <EvidenceSection room={roomData} currentUserId={currentUserId} />
            <ChatCard room={roomData} currentUserId={currentUserId} />
          </div>

          <ParticipantsPanel room={roomData} />
        </div>
      </div>

      <RoomFooterBar
        onSubmit={handleChatSubmit}
        onBetClick={handleOpenBetModal}
        onEvidenceClick={handleOpenEvidenceModal}
        isEvidenceDisabled={isEvidenceDisabled}
        hasSubmittedEvidence={hasSubmittedEvidence}
        maxLength={ROOM_CHAT_CONSTRAINTS.maxLength}
        isBetDisabled={hasPlacedBet}
      />
    </div>
  );
}

export { RoomShell };
