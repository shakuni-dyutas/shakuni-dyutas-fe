'use client';

import { useMemo } from 'react';

import { ROOM_CHAT_CONSTRAINTS } from '@/entities/room/config/constants';
import { useRoomDetailSnapshot } from '@/entities/room/model/use-room-detail-snapshot';
import { useRoomEvents } from '@/entities/room/model/use-room-events';
import { openBetModal } from '@/features/bet-place/ui/bet-modal';
import { openEvidenceModal } from '@/features/evidence-submit/ui/evidence-modal';
import { Button } from '@/shared/ui/button';
import { useRoomBettingState } from '@/widgets/room-shell/model/use-room-betting-state';
import { useRoomChatState } from '@/widgets/room-shell/model/use-room-chat-state';
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
  useRoomEvents(roomId);

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
    if (!betting) {
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
