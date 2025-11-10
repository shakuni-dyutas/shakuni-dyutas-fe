'use client';

import type { RoomDetail } from '@/entities/room/types/room-detail';
import { openBetModal } from '@/features/bet-place/ui/bet-modal';
import { openEvidenceModal } from '@/features/evidence-submit/ui/evidence-modal';
import { Button } from '@/shared/ui/button';
import { useRoomShellState } from '@/widgets/room-shell/model/use-room-shell-state';
import { ChatCard } from '@/widgets/room-shell/ui/chat-card';
import { EvidenceSection } from '@/widgets/room-shell/ui/evidence-section';
import { ParticipantsPanel } from '@/widgets/room-shell/ui/participants-panel';
import { RoomFooterBar } from '@/widgets/room-shell/ui/room-footer-bar';
import { RoomSummaryBar } from '@/widgets/room-shell/ui/room-summary-bar';
import { RoomShellSkeleton } from './room-shell-skeleton';

interface RoomShellProps {
  room: RoomDetail | null;
  isLoading: boolean;
  onRetry?: () => void;
}

function RoomShell({ room, isLoading, onRetry }: RoomShellProps) {
  const {
    roomData,
    currentUserId,
    currentFaction,
    hasSubmittedEvidence,
    isEvidenceDisabled,
    handleEvidenceSubmit,
    handleChatSubmit,
  } = useRoomShellState({ room });

  if (isLoading && !roomData) {
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
        <Button onClick={onRetry}>다시 시도</Button>
      </div>
    );
  }

  const handleOpenBetModal = () => {
    openBetModal({
      roomTitle: roomData.title,
      factions: roomData.factions,
      betting: roomData.betting,
    }).catch(() => {});
  };

  const handleOpenEvidenceModal = () => {
    openEvidenceModal({
      roomTitle: roomData.title,
      faction: currentFaction,
      restrictions: roomData.restrictions.evidence,
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
        maxLength={roomData.restrictions.chat.maxLength}
      />
    </div>
  );
}

export { RoomShell };
