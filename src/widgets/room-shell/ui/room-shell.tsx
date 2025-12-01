'use client';

import { CircleSlash } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ROOM_CHAT_CONSTRAINTS } from '@/entities/room/config/constants';
import { useRoomDetailSnapshot } from '@/entities/room/model/use-room-detail-snapshot';
import { openBetModal } from '@/features/bet-place/ui/bet-modal';
import { openEvidenceModal } from '@/features/evidence-submit/ui/evidence-modal';
import { Button } from '@/shared/ui/button';
import { useRoomBettingState } from '@/widgets/room-shell/model/use-room-betting-state';
import { useRoomChatState } from '@/widgets/room-shell/model/use-room-chat-state';
import { useRoomEndFlow } from '@/widgets/room-shell/model/use-room-end-flow';
import { useRoomEvidenceState } from '@/widgets/room-shell/model/use-room-evidence-state';
import { useRoomMetaState } from '@/widgets/room-shell/model/use-room-meta-state';
import { useRoomParticipantsState } from '@/widgets/room-shell/model/use-room-participants-state';
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
  const detailQuery = useRoomDetailSnapshot(roomId);
  const { endedInfo, handleViewResult } = useRoomEndFlow(roomId);
  const [isMockingEnd, setIsMockingEnd] = useState(false);
  const isDev = process.env.NODE_ENV !== 'production';

  const room = detailQuery.data ?? null;

  const isInitialLoading =
    !room && (detailQuery.isLoading || detailQuery.isPending || detailQuery.isFetching);

  const { meta, factionColorMap } = useRoomMetaState(room);
  const { participants, currentUserId, currentParticipant } = useRoomParticipantsState(room);
  const { betting, currentFaction, hasPlacedBet, applyBettingSnapshot } = useRoomBettingState({
    room,
    factionColorMap,
    currentParticipant,
  });
  const { evidenceGroups, hasSubmittedEvidence, isEvidenceDisabled, handleEvidenceSubmit } =
    useRoomEvidenceState({
      room,
      currentParticipant,
      currentUserId,
    });
  const { chatMessages, handleChatSubmit } = useRoomChatState({ room, currentParticipant });
  const roomData = useMemo(() => {
    if (!meta || !participants || !betting || !evidenceGroups || !chatMessages) {
      return null;
    }
    return {
      ...meta,
      participants,
      betting,
      evidenceGroups,
      chatMessages,
    };
  }, [betting, chatMessages, evidenceGroups, meta, participants]);

  if (isInitialLoading && !roomData) {
    return <RoomShellSkeleton />;
  }

  if (!roomData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/10 px-4 text-center">
        <div className="space-y-2">
          <p className="font-semibold text-xl">방 정보를 불러오지 못했어요.</p>
          <p className="text-muted-foreground text-sm">
            잠시 후 다시 시도하거나 홈으로 이동해 주세요.
          </p>
        </div>
        <Button onClick={() => void detailQuery.refetch()}>다시 시도</Button>
      </div>
    );
  }

  const handleOpenBetModal = () => {
    if (!betting || isRoomEnded) {
      return;
    }

    openBetModal({
      roomId: roomData.id,
      roomTitle: roomData.title,
      factions: betting.factions,
      betting,
      onSuccess: (response) => {
        applyBettingSnapshot({
          betting: response.betting,
          participants: response.participants,
        });
      },
    }).catch(() => {});
  };

  const handleOpenEvidenceModal = () => {
    if (isRoomEnded) {
      return;
    }
    openEvidenceModal({
      roomTitle: roomData.title,
      faction: currentFaction,
      hasSubmitted: hasSubmittedEvidence,
      onSubmit: handleEvidenceSubmit,
    }).catch(() => {});
  };

  const handleChatSubmitSafe = async (value: string) => {
    if (isRoomEnded) {
      return;
    }
    await handleChatSubmit(value);
  };

  const handleMockEnd = async () => {
    if (!roomId) {
      return;
    }
    setIsMockingEnd(true);
    try {
      await fetch(`/api/rooms/${roomId}/end`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to trigger mock end event', error);
    } finally {
      setIsMockingEnd(false);
    }
  };

  const isRoomEnded = Boolean(endedInfo);

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-40">
      {isRoomEnded ? (
        <div className="border-destructive/40 border-b bg-destructive/10 px-4 py-3 text-destructive">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CircleSlash className="h-5 w-5" aria-hidden />
              <div className="space-y-1">
                <p className="font-semibold text-sm">이 재판은 종료되었습니다.</p>
                <p className="text-destructive/90 text-xs">
                  상호작용은 종료되었으며 결과만 확인할 수 있습니다.
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleViewResult}>
              결과 확인
            </Button>
          </div>
        </div>
      ) : null}

      <RoomSummaryBar room={roomData} />
      {isDev ? (
        <div className="mx-auto flex w-full max-w-6xl justify-end px-4 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMockEnd}
            disabled={isMockingEnd}
            className="text-xs"
          >
            {isMockingEnd ? '종료 시뮬레이션 중…' : '종료 이벤트 시뮬레이트'}
          </Button>
        </div>
      ) : null}

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
        onSubmit={handleChatSubmitSafe}
        onBetClick={handleOpenBetModal}
        onEvidenceClick={handleOpenEvidenceModal}
        isEvidenceDisabled={isEvidenceDisabled || isRoomEnded}
        hasSubmittedEvidence={hasSubmittedEvidence}
        maxLength={ROOM_CHAT_CONSTRAINTS.maxLength}
        isBetDisabled={hasPlacedBet || isRoomEnded}
        isEnded={isRoomEnded}
        onResultClick={handleViewResult}
      />
    </div>
  );
}

export { RoomShell };
