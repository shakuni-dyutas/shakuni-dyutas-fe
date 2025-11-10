import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { RoomDetail } from '@/entities/room/types/room-detail';
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
          <CollapsibleContent className="space-y-4 overflow-hidden transition-[max-height,opacity] duration-200 data-[state=open]:mt-4 data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
            {room.chatMessages.slice(0, 5).map((message) => {
              const isMine = Boolean(currentUserId && message.author.id === currentUserId);

              return (
                <article
                  key={message.id}
                  className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'flex max-w-2xl items-start gap-3 rounded-3xl px-4 py-3',
                      isMine
                        ? 'flex-row-reverse bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-foreground',
                    )}
                  >
                    <Avatar className="size-9 border border-border/70">
                      <AvatarImage
                        src={message.author.avatarUrl ?? undefined}
                        alt={message.author.nickname}
                      />
                      <AvatarFallback>{message.author.nickname.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className={cn('space-y-1 text-left', isMine && 'text-right')}>
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                        <span className="font-semibold text-foreground">
                          {isMine ? '나' : message.author.nickname}
                        </span>
                        <Badge
                          style={{ backgroundColor: findFactionColor(room, message.factionId) }}
                        >
                          {resolveFactionName(room, message.factionId)}
                        </Badge>
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm">{message.body}</p>
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

function resolveFactionName(room: RoomDetail, factionId: string) {
  return room.factions.find((faction) => faction.id === factionId)?.name ?? '진영';
}

export { ChatCard };
