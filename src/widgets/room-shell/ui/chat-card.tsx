import type { RoomDetail } from '@/entities/room/types/room-detail';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

interface ChatCardProps {
  room: RoomDetail;
  currentUserId: string | null;
}

function ChatCard({ room, currentUserId }: ChatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs uppercase">공용 채팅</p>
            <h2 className="font-semibold text-lg">전체 대화방</h2>
          </div>
          <Badge variant="secondary">{room.chatMessages.length} 메시지</Badge>
        </div>
        <div className="space-y-4">
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
                      <Badge style={{ backgroundColor: findFactionColor(room, message.factionId) }}>
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
        </div>
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
