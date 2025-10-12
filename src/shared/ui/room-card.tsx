import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

import type { Room } from '@/entities/room/types/room';

interface RoomCardProps {
  room: Room;
  onEnterRoom?: (roomId: string) => void;
  className?: string;
}

function RoomCard({ room, onEnterRoom, className }: RoomCardProps) {
  const handleEnter = () => {
    onEnterRoom?.(room.id);
  };

  const aRatio = Math.max(0, Math.min(100, room.team_a_ratio));
  const bRatio = Math.max(0, Math.min(100, room.team_b_ratio));

  return (
    <Card className={className} data-slot="room-card" aria-label={`room-${room.id}`}>
      <CardContent className="flex flex-col gap-3 p-4">
        <header className="space-y-1">
          <h3 className="font-semibold text-base leading-tight">{room.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{room.description}</p>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-foreground/80">{room.team_a}</span>
              <span className="text-xs tabular-nums">{aRatio}%</span>
            </div>
            <Progress value={aRatio} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-foreground/80">{room.team_b}</span>
              <span className="text-xs tabular-nums">{bRatio}%</span>
            </div>
            <Progress value={bRatio} />
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" aria-label="participants">
            참가 {room.participants.toLocaleString()} / {room.max_participants.toLocaleString()}
          </Badge>
          <Badge variant="secondary" aria-label="total-betting">
            총 배팅 {room.total_betting.toLocaleString()}
          </Badge>
          <Badge variant={room.status === 'active' ? 'success' : 'outline'} aria-label="status">
            {room.status === 'active' ? 'Active' : 'Ended'}
          </Badge>
          {room.time_left && room.time_left !== '—' ? (
            <Badge variant="info" aria-label="time-left">남은 시간 {room.time_left}</Badge>
          ) : null}
        </section>

        <footer className="flex justify-end pt-1">
          <Button type="button" onClick={handleEnter} aria-label="enter-room">
            입장하기
          </Button>
        </footer>
      </CardContent>
    </Card>
  );
}

export type { RoomCardProps };
export { RoomCard };


