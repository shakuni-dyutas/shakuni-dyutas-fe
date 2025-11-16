import type { RoomDetail } from '@/entities/room/types/room-detail';

interface RoomSummaryBarProps {
  room: RoomDetail;
}

function RoomSummaryBar({ room }: RoomSummaryBarProps) {
  const remainingSeconds = Math.max(
    0,
    Math.floor((new Date(room.countdown.endsAt).getTime() - Date.now()) / 1000),
  );

  return (
    <section className="w-full border-border border-b bg-background/95 shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">현재 주제</p>
          <h1 className="font-semibold text-2xl text-foreground leading-tight">{room.title}</h1>
          <p className="text-muted-foreground text-sm">{room.topic}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <PlaceholderStat label="상단 통계" subLabel="타이머/차트 자리" />
          <PlaceholderStat
            label="포인트 풀"
            subLabel={`${room.betting.totalPoolPoints.toLocaleString()} pts`}
          />
          <PlaceholderStat
            label="남은 시간"
            subLabel={`${Math.floor(remainingSeconds / 60)}분 남음`}
          />
        </div>
      </div>
    </section>
  );
}

function PlaceholderStat({ label, subLabel }: { label: string; subLabel: string }) {
  return (
    <div className="rounded-2xl border border-border/90 border-dashed bg-muted/40 px-4 py-3">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-base text-foreground">{subLabel}</p>
    </div>
  );
}

export { RoomSummaryBar };
