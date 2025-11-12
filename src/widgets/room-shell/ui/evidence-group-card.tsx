'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

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
  const submissions = useMemo(
    () =>
      [...group.submissions].sort(
        (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      ),
    [group.submissions],
  );

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
          <CollapsibleContent className="flex flex-col gap-4 overflow-hidden text-sm transition-[max-height,opacity] duration-200 data-[state=open]:mt-4 data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
            {submissions.map((submission) => {
              const isMine = Boolean(currentUserId && submission.author.id === currentUserId);
              const attachments = submission.media.filter((media) => media.type === 'image');

              return (
                <article
                  key={submission.id}
                  className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'flex max-w-2xl flex-col gap-3 rounded-3xl border px-4 py-3 shadow-sm sm:flex-row',
                      isMine
                        ? 'border-primary/40 bg-primary/10 text-foreground sm:flex-row-reverse'
                        : 'border-border/70 bg-card/80 text-foreground',
                    )}
                  >
                    <Avatar className="size-10 border border-border/60">
                      <AvatarImage
                        src={submission.author.avatarUrl ?? undefined}
                        alt={submission.author.nickname}
                      />
                      <AvatarFallback>{submission.author.nickname.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className={cn('flex-1 space-y-2 text-left', isMine && 'text-right')}>
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                        <Badge
                          variant={isMine ? 'default' : 'secondary'}
                          className={cn(
                            'rounded-full px-2 py-0 text-[11px] uppercase tracking-tight',
                            isMine
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground',
                          )}
                        >
                          {isMine ? '나의 증거' : submission.author.nickname}
                        </Badge>
                        <span>
                          {new Intl.DateTimeFormat('ko-KR').format(
                            new Date(submission.submittedAt),
                          )}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-base">{submission.summary}</p>
                        <p className="text-sm opacity-90">{submission.body}</p>
                      </div>
                      {attachments.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {attachments.slice(0, 3).map((media) => (
                            <div
                              key={media.id}
                              className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted"
                            >
                              <Image
                                src={media.url}
                                alt={`${submission.summary} 첨부 이미지`}
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {attachments.length > 3 ? (
                            <div className="flex items-center justify-center rounded-2xl border border-border/60 border-dashed text-muted-foreground text-xs">
                              +{attachments.length - 3} 이미지
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function findFactionColor(room: RoomDetail, factionId: string) {
  return room.factions.find((faction) => faction.id === factionId)?.color ?? '#0ea5e9';
}

export { EvidenceGroupCard };
