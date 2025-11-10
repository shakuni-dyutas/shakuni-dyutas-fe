import type { RoomDetail } from '@/entities/room/types/room-detail';
import { Card, CardContent } from '@/shared/ui/card';
import { EvidenceGroupCard } from '@/widgets/room-shell/ui/evidence-group-card';

interface EvidenceSectionProps {
  room: RoomDetail;
  currentUserId: string | null;
}

function EvidenceSection({ room, currentUserId }: EvidenceSectionProps) {
  if (room.evidenceGroups.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">증거 목록</h2>
            <p className="text-muted-foreground text-sm">아직 제출된 증거가 없어요.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {room.evidenceGroups.map((group) => (
        <EvidenceGroupCard
          key={group.factionId}
          room={room}
          group={group}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export { EvidenceSection };
