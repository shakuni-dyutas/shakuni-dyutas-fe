'use client';

import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { RoomDetail } from '@/entities/room/types/room-detail';
import { TEAM_FACTION_NONE_ID } from '@/entities/team/config/constants';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';

interface ChatCardProps {
  room: RoomDetail;
  currentUserId: string | null;
}

function ChatCard({ room, currentUserId }: ChatCardProps) {
  const [open, setOpen] = useState(true);
  const orderedMessages = useMemo(
    () =>
      [...room.chatMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [room.chatMessages],
  );

  return (
    <Card>
      <CardContent className="space-y-4">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs uppercase">공용 채팅</p>
              <h2 className="font-semibold text-lg">전체 대화방</h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{room.chatMessages.length} 메시지</Badge>
              <CollapsibleTrigger className="rounded-full border border-border/60 p-2 text-xs">
                <ChevronDown
                  className={cn('size-4 transition-transform', open ? 'rotate-180' : 'rotate-0')}
                  aria-hidden
                />
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="overflow-hidden transition-[max-height,opacity] duration-200 data-[state=open]:mt-4 data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
            <div className="flex max-h-[28rem] flex-col gap-4 overflow-y-auto pr-1">
              {orderedMessages.map((message) => {
                const isMine = Boolean(currentUserId && message.author.id === currentUserId);

                return (
                  <article
                    key={message.id}
                    className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'flex max-w-2xl items-start gap-3 rounded-3xl border px-4 py-3 shadow-sm',
                        isMine
                          ? 'flex-row-reverse border-primary/40 bg-primary/10 text-foreground'
                          : 'border-border/70 bg-muted/40 text-foreground',
                      )}
                    >
                      <Avatar className="size-9 border border-border/70">
                        <AvatarImage
                          src={message.author.avatarUrl ?? undefined}
                          alt={message.author.nickname}
                        />
                        <AvatarFallback>{message.author.nickname.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className={cn('space-y-1 text-left text-sm', isMine && 'text-right')}>
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
                            {isMine ? '나' : message.author.nickname}
                          </Badge>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: findFactionColor(room, message.factionId),
                              color: findFactionColor(room, message.factionId),
                            }}
                          >
                            {resolveFactionName(room, message.factionId)}
                          </Badge>
                          <span>{formatChatTimestamp(message.createdAt)}</span>
                        </div>
                        <p>{message.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

const DEFAULT_FACTION_COLOR = '#475569';

function findFactionColor(room: RoomDetail, factionId: string) {
  return (
    room.betting.factions.find((faction) => faction.id === factionId)?.color ??
    DEFAULT_FACTION_COLOR
  );
}

function formatChatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(timestamp));
}

function resolveFactionName(room: RoomDetail, factionId: string) {
  if (factionId === TEAM_FACTION_NONE_ID) {
    return '진영 없음';
  }

  return room.betting.factions.find((faction) => faction.id === factionId)?.name ?? '진영';
}

export { ChatCard };
