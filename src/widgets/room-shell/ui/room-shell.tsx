'use client';

import type { RoomDetail } from '@/entities/room/types/room-detail';
import { useSessionStore } from '@/entities/session/model/session-store';
import { Button } from '@/shared/ui/button';
import { ChatCard } from '@/widgets/room-shell/ui/chat-card';
import { ChatInputBar } from '@/widgets/room-shell/ui/chat-input-bar';
import { EvidenceSection } from '@/widgets/room-shell/ui/evidence-section';
import { ParticipantsPanel } from '@/widgets/room-shell/ui/participants-panel';
import { RoomActionButtons } from '@/widgets/room-shell/ui/room-action-buttons';
import { RoomSummaryBar } from '@/widgets/room-shell/ui/room-summary-bar';
import { RoomShellSkeleton } from './room-shell-skeleton';

interface RoomShellProps {
  room: RoomDetail | null;
  isLoading: boolean;
  onRetry?: () => void;
}

function RoomShell({ room, isLoading, onRetry }: RoomShellProps) {
  const currentUserId = useSessionStore((state) => state.user?.id ?? null);

  if (isLoading && !room) {
    return <RoomShellSkeleton />;
  }

  if (!room) {
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

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-40">
      <RoomSummaryBar room={room} />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <EvidenceSection room={room} currentUserId={currentUserId} />
            <ChatCard room={room} currentUserId={currentUserId} />
            <RoomActionButtons />
          </div>

          <ParticipantsPanel room={room} />
        </div>
      </div>

      <ChatInputBar />
    </div>
  );
}

export { RoomShell };
