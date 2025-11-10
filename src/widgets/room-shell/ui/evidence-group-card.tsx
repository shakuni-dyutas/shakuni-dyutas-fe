import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { RoomDetail } from '@/entities/room/types/room-detail';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';

interface EvidenceGroupCardProps {
  room: RoomDetail;
  group: RoomDetail['evidenceGroups'][number];
  currentUserId: string | null;
}

function EvidenceGroupCard({ room, group, currentUserId }: EvidenceGroupCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs uppercase">증거 제출</p>
              <h2 className="font-semibold text-lg">{group.factionName}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className="uppercase"
                style={{ backgroundColor: findFactionColor(room, group.factionId) }}
              >
                {group.submissions.length}개
              </Badge>
              <CollapsibleTrigger className="rounded-full border border-border/60 p-2">
                <ChevronDown
                  className={cn('size-4 transition-transform', open ? 'rotate-180' : 'rotate-0')}
                  aria-hidden
                />
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="space-y-4 overflow-hidden text-sm transition-[max-height,opacity] duration-200 data-[state=open]:mt-4 data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
            {group.submissions.slice(0, 3).map((submission) => {
              const isMine = Boolean(currentUserId && submission.author.id === currentUserId);

              return (
                <article
                  key={submission.id}
                  className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                >
                  <div
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
                  </div>
                </article>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {group.submissions.length > 3 ? (
          <p className="text-muted-foreground text-sm">
            +{group.submissions.length - 3}개의 추가 증거 · 접기/펼치기는 후속 단계에서 제공됩니다.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function findFactionColor(room: RoomDetail, factionId: string) {
  return room.factions.find((faction) => faction.id === factionId)?.color ?? '#0ea5e9';
}

export { EvidenceGroupCard };
