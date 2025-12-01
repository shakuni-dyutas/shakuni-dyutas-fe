'use client';

function RankingListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`ranking-card-skeleton-${index + 1}`}
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="h-4 w-8 rounded-full bg-muted/60" />
            <div className="h-10 w-10 rounded-full bg-muted/70" />
            <div className="flex flex-col gap-1">
              <div className="h-4 w-28 rounded-full bg-muted/70" />
              <div className="h-3 w-20 rounded-full bg-muted/50" />
            </div>
          </div>
          <div className="h-4 w-16 rounded-full bg-muted/60" />
        </div>
      ))}
    </div>
  );
}

export { RankingListSkeleton };
