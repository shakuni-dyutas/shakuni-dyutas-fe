'use client';

import { RefreshCcw } from 'lucide-react';
import { useMemo } from 'react';

import type { RankingUser } from '@/entities/ranking/types/ranking';
import { Button } from '@/shared/ui/button';
import { useRankingLoadMore } from '@/widgets/ranking/model/use-ranking-load-more';
import { RankingCurrentUserCard } from '@/widgets/ranking/ui/ranking-current-user-card';
import { RankingItem } from '@/widgets/ranking/ui/ranking-item';
import { RankingListSkeleton } from '@/widgets/ranking/ui/ranking-list-skeleton';

interface RankingListProps {
  items: RankingUser[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hasNextPage?: boolean;
  onLoadMore: () => void;
  isFetchingNextPage?: boolean;
  myRank?: number | null;
  currentUser?: RankingUser | null;
  anchorId: string;
  loadMoreError?: boolean;
}

function RankingList({
  items,
  isLoading = false,
  isError = false,
  onRetry,
  hasNextPage = false,
  onLoadMore,
  isFetchingNextPage = false,
  myRank,
  currentUser,
  anchorId,
  loadMoreError = false,
}: RankingListProps) {
  const hasItems = items.length > 0;
  const sortedItems = useMemo(() => [...items].sort((a, b) => a.rank - b.rank), [items]);
  const { loadMoreRef } = useRankingLoadMore({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    enabled: !loadMoreError,
  });

  return (
    <section id={anchorId} tabIndex={-1} aria-label="랭킹 목록" className="flex flex-col gap-4">
      {isError ? (
        <div className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive">
          랭킹 목록을 불러오지 못했어요.
          {onRetry ? (
            <Button size="sm" variant="ghost" onClick={onRetry}>
              다시 시도
            </Button>
          ) : null}
        </div>
      ) : null}

      {isLoading && !hasItems ? <RankingListSkeleton /> : null}

      {!isLoading && !hasItems ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : null}

      {currentUser ? <RankingCurrentUserCard user={currentUser} /> : null}

      {hasItems ? (
        <ul className="flex flex-col gap-3">
          {sortedItems.map((user) => (
            <RankingItem key={user.userId} user={user} />
          ))}
        </ul>
      ) : null}

      {hasNextPage ? (
        <div className="flex flex-col items-center gap-2">
          <div ref={loadMoreRef} aria-hidden="true" />
          {loadMoreError ? (
            <div className="text-destructive text-sm">다음 페이지를 불러오지 못했어요.</div>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={14} aria-hidden />
            {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export { RankingList };
