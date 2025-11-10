import { Fragment } from 'react';

import type { RoomDetail } from '@/entities/room/types/room-detail';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

interface ParticipantsPanelProps {
  room: RoomDetail;
}

function ParticipantsPanel({ room }: ParticipantsPanelProps) {
  return (
    <Card className="lg:sticky lg:top-4">
      <CardContent className="space-y-5">
        <div>
          <p className="text-muted-foreground text-xs uppercase">현재 참가자</p>
          <h2 className="font-semibold text-lg">{room.participants.length}명 참여 중</h2>
        </div>
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
      </CardContent>
    </Card>
  );
}

export { ParticipantsPanel };
