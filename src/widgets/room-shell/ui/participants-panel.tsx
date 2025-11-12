import { ChevronDown } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { RoomDetail } from '@/entities/room/types/room-detail';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';

interface ParticipantsPanelProps {
  room: RoomDetail;
}

function ParticipantsPanel({ room }: ParticipantsPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <Card className={cn(open ? 'lg:sticky lg:top-4' : '')}>
      <CardContent className="space-y-5">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs uppercase">현재 참가자</p>
              <h2 className="font-semibold text-lg">{room.participants.length}명 참여 중</h2>
            </div>
            <CollapsibleTrigger className="rounded-full border border-border/60 p-2">
              <ChevronDown
                className={cn('size-4 transition-transform', open ? 'rotate-180' : 'rotate-0')}
                aria-hidden
              />
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="overflow-hidden transition-[max-height,opacity] duration-200 data-[state=open]:mt-4 data-[state=closed]:max-h-0 data-[state=open]:max-h-[600px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
            <div className="flex max-h-[28rem] flex-col gap-4 overflow-y-auto pr-1">
              {room.factions.map((faction) => {
                const members = room.participants.filter(
                  (participant) => participant.factionId === faction.id,
                );

                return (
                  <Fragment key={faction.id}>
                    <div className="flex items-center justify-between rounded-2xl bg-muted/30 px-3 py-2">
                      <div>
                        <p className="font-medium">{faction.name}</p>
                        <p className="text-muted-foreground text-xs">{members.length}명 참여</p>
                      </div>
                      <Badge style={{ backgroundColor: faction.color }}>진영</Badge>
                    </div>

                    <ul className="space-y-2">
                      {members.length === 0 ? (
                        <li className="rounded-xl border border-border/70 border-dashed px-3 py-2 text-muted-foreground text-sm">
                          아직 참가자가 없습니다.
                        </li>
                      ) : (
                        members.map((participant) => (
                          <li
                            key={participant.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3 py-2"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarImage
                                  src={participant.avatarUrl ?? undefined}
                                  alt={participant.nickname}
                                />
                                <AvatarFallback>{participant.nickname.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{participant.nickname}</p>
                                <p className="text-muted-foreground text-xs">
                                  {participant.role === 'host' ? '방장' : '참가자'}
                                </p>
                              </div>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {participant.totalBetPoints.toLocaleString()} pts
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </Fragment>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export { ParticipantsPanel };
