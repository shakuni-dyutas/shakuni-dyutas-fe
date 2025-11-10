import type { RoomDetail } from '@/entities/room/types/room-detail';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

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
        <Card key={group.factionId} className="overflow-hidden">
          <CardContent className="space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-xs uppercase">증거 제출</p>
                <h2 className="font-semibold text-lg">{group.factionName}</h2>
              </div>
              <Badge
                className="uppercase"
                style={{ backgroundColor: findFactionColor(room, group.factionId) }}
              >
                {group.submissions.length}개
              </Badge>
            </header>

            <ul className="space-y-4 text-sm">
              {group.submissions.slice(0, 3).map((submission) => {
                const isMine = Boolean(currentUserId && submission.author.id === currentUserId);

                return (
                  <li
                    key={submission.id}
                    className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                  >
                    <article
                      className={cn(
                        'flex max-w-2xl items-start gap-3 rounded-3xl border border-border/70 px-4 py-3 shadow-sm',
                        isMine
                          ? 'flex-row-reverse bg-primary text-primary-foreground'
                          : 'bg-card/80 text-foreground',
                      )}
                    >
                      <Avatar className="size-10 border border-border/60">
                        <AvatarImage
                          src={submission.author.avatarUrl ?? undefined}
                          alt={submission.author.nickname}
                        />
                        <AvatarFallback>{submission.author.nickname.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className={cn('space-y-1 text-left', isMine && 'text-right')}>
                        <p className="text-muted-foreground text-xs uppercase">
                          {isMine ? '나의 증거' : submission.author.nickname}
                        </p>
                        <p className="font-semibold text-base">{submission.summary}</p>
                        <p className="text-sm opacity-90">{submission.body}</p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>

            {group.submissions.length > 3 ? (
              <p className="text-muted-foreground text-sm">
                +{group.submissions.length - 3}개의 추가 증거 · 접기/펼치기는 후속 단계에서
                제공됩니다.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function findFactionColor(room: RoomDetail, factionId: string) {
  return room.factions.find((faction) => faction.id === factionId)?.color ?? '#0ea5e9';
}

export { EvidenceSection };
