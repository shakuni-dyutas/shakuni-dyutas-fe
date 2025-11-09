import type { Room } from '@/entities/room/types/room';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface RoomCardProps {
  room: Room;
  onEnterRoom?: (roomId: string) => void;
  className?: string;
}

const ROOM_BADGE_THRESHOLDS = {
  NEW_ROOM_HOURS: 24,
  HOT_BETTING_AMOUNT: 15000,
  HOT_PARTICIPANTS: 30,
} as const;

function RoomCard({ room, onEnterRoom, className }: RoomCardProps) {
  const handleEnter = () => {
    onEnterRoom?.(room.id);
  };

  const rawARatio = Math.max(0, Math.min(100, room.team_a_ratio));
  const rawBRatio = Math.max(0, Math.min(100, room.team_b_ratio));
  const ratioSum = rawARatio + rawBRatio || 1;
  const aRatio = Math.round((rawARatio / ratioSum) * 100);
  const bRatio = Math.max(0, 100 - aRatio);

  // TODO: 추후 위치 / 구조 변경 예정
  const createdAtMs = Date.parse(room.created_at);
  const isNew =
    Number.isFinite(createdAtMs) &&
    Date.now() - createdAtMs <= ROOM_BADGE_THRESHOLDS.NEW_ROOM_HOURS * 60 * 60 * 1000;
  const isHot =
    room.total_betting >= ROOM_BADGE_THRESHOLDS.HOT_BETTING_AMOUNT ||
    room.participants >= ROOM_BADGE_THRESHOLDS.HOT_PARTICIPANTS;

  return (
    <Card className={className} data-slot="room-card" aria-label={`room-${room.id}`}>
      <CardContent className="flex flex-col gap-3 p-4">
        <header className="space-y-1">
          <h3 className="font-semibold text-base leading-tight">{room.title}</h3>
          <p className="line-clamp-2 text-muted-foreground text-sm">{room.description}</p>
        </header>

        <section className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground/80 text-xs">{room.team_a}</span>
              <span className="text-xs tabular-nums">{aRatio}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums">{bRatio}%</span>
              <span className="font-medium text-foreground/80 text-xs">{room.team_b}</span>
            </div>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute top-0 left-0 h-full rounded-l-full bg-gradient-to-r from-red-600 to-red-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] dark:from-red-500 dark:to-red-400"
              style={{ width: `${aRatio}%` }}
            />
            <div
              className="absolute top-0 right-0 h-full rounded-r-full bg-gradient-to-l from-blue-600 to-blue-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] dark:from-blue-500 dark:to-blue-400"
              style={{ width: `${bRatio}%` }}
            />
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

          {/* TODO: 추후 위치 / 구조 변경 예정 */}
          {isHot ? (
            <Badge variant="warning" aria-label="hot">
              Hot
            </Badge>
          ) : null}
          {isNew ? (
            <Badge variant="info" aria-label="new">
              New
            </Badge>
          ) : null}
          {room.time_left && room.time_left !== '—' ? (
            <Badge variant="info" aria-label="time-left">
              남은 시간 {room.time_left}
            </Badge>
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
