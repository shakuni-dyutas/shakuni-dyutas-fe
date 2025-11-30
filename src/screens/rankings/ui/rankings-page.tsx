import type { Metadata } from 'next';
import { RankingsFocusAnchor } from '@/screens/rankings/ui/rankings-focus-anchor';
import { cn } from '@/shared/lib/utils';

const RANKINGS_LIST_ID = 'rankings-list';

function RankingsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <search
          aria-label="랭킹 검색 영역"
          className="h-11 w-full rounded-lg bg-muted/70 md:max-w-md"
        />
        <a
          href={`#${RANKINGS_LIST_ID}`}
          className="font-semibold text-primary text-sm hover:underline focus-visible:underline"
        >
          내 순위로 이동
        </a>
      </header>

      <section aria-label="상위 3위 포디움" className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`podium-skeleton-${index + 1}`}
            className={cn(
              'rounded-xl border border-border bg-card p-4 shadow-sm',
              index === 0 && 'md:translate-y-0',
              index === 1 && 'md:translate-y-2',
              index === 2 && 'md:translate-y-4',
            )}
          >
            <div className="mb-3 h-6 w-20 rounded-full bg-muted/70" />
            <div className="mb-2 h-4 w-28 rounded-full bg-muted/60" />
            <div className="h-4 w-16 rounded-full bg-muted/50" />
          </div>
        ))}
      </section>

      <section
        id={RANKINGS_LIST_ID}
        tabIndex={-1}
        aria-label="랭킹 목록"
        className="flex flex-col gap-3"
      >
        <RankingsFocusAnchor targetId={RANKINGS_LIST_ID} />
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
      </section>
    </div>
  );
}

function RankingsPageFallback() {
  return null;
}

const rankingsMetadata: Metadata = {
  title: '랭킹',
  description: '글로벌 랭킹과 상위 사용자 포디움을 확인하세요.',
};

export { RANKINGS_LIST_ID, RankingsPage, RankingsPageFallback, rankingsMetadata };
