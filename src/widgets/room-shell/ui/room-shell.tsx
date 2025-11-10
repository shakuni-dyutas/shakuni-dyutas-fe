'use client';

import { useEffect, useMemo, useState } from 'react';

import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { useSessionStore } from '@/entities/session/model/session-store';
import { openBetModal } from '@/features/bet-place/ui/bet-modal';
import type { EvidenceSubmitPayload } from '@/features/evidence-submit/ui/evidence-modal';
import { openEvidenceModal } from '@/features/evidence-submit/ui/evidence-modal';
import { Button } from '@/shared/ui/button';
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
  const currentUserId = useSessionStore((state) => state.user?.id ?? null);
  const [localEvidenceGroups, setLocalEvidenceGroups] = useState(room?.evidenceGroups ?? []);

  useEffect(() => {
    if (!room) {
      setLocalEvidenceGroups([]);
      return;
    }

    setLocalEvidenceGroups(room.evidenceGroups);
  }, [room]);

  const roomWithEvidence = useMemo(() => {
    if (!room) {
      return null;
    }

    return { ...room, evidenceGroups: localEvidenceGroups } satisfies RoomDetail;
  }, [room, localEvidenceGroups]);

  const currentParticipant = useMemo(() => {
    if (!room || !currentUserId) {
      return null;
    }

    return room.participants.find((participant) => participant.id === currentUserId) ?? null;
  }, [currentUserId, room]);

  const currentFaction = useMemo(() => {
    if (!room || !currentParticipant) {
      return null;
    }

    return room.factions.find((faction) => faction.id === currentParticipant.factionId) ?? null;
  }, [currentParticipant, room]);

  const hasSubmittedEvidence = useMemo(() => {
    if (!currentUserId) {
      return false;
    }

    return localEvidenceGroups.some((group) =>
      group.submissions.some((submission) => submission.author.id === currentUserId),
    );
  }, [currentUserId, localEvidenceGroups]);

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

  const handleOpenBetModal = () => {
    openBetModal({
      roomTitle: room.title,
      factions: room.factions,
      betting: room.betting,
    }).catch(() => {});
  };

  const handleEvidenceSubmit = async (payload: EvidenceSubmitPayload) => {
    if (!room || !currentParticipant) {
      return;
    }

    const submissionId = generateTempId();
    const newSubmission: EvidenceItem = {
      id: submissionId,
      roomId: room.id,
      factionId: payload.factionId,
      author: currentParticipant,
      summary: payload.summary,
      body: payload.body,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      media: payload.images.map((file, index) => ({
        id: `${submissionId}-media-${index}`,
        type: 'image',
        url: `local:${file.name}`,
        sizeInBytes: file.size,
      })),
    };

    setLocalEvidenceGroups((prev) => {
      const factionName =
        room.factions.find((faction) => faction.id === payload.factionId)?.name ?? '내 진영';

      const nextGroups = prev.some((group) => group.factionId === payload.factionId)
        ? prev.map((group) =>
            group.factionId === payload.factionId
              ? { ...group, submissions: [newSubmission, ...group.submissions] }
              : group,
          )
        : [
            ...prev,
            {
              factionId: payload.factionId,
              factionName,
              submissions: [newSubmission],
            },
          ];

      return nextGroups;
    });
  };

  const handleOpenEvidenceModal = () => {
    openEvidenceModal({
      roomTitle: room.title,
      faction: currentFaction,
      restrictions: room.restrictions.evidence,
      hasSubmitted: hasSubmittedEvidence,
      onSubmit: async (values) => {
        await handleEvidenceSubmit(values);
      },
    }).catch(() => {});
  };

  const roomData = roomWithEvidence ?? room;
  const isEvidenceDisabled = !currentFaction || hasSubmittedEvidence;

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
        onBetClick={handleOpenBetModal}
        onEvidenceClick={handleOpenEvidenceModal}
        isEvidenceDisabled={isEvidenceDisabled}
        hasSubmittedEvidence={hasSubmittedEvidence}
      />
    </div>
  );
}

function generateTempId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

export { RoomShell };
