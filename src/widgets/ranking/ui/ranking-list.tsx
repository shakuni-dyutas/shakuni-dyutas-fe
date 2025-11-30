'use client';

import { RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

import type { RankingUser } from '@/entities/ranking/types/ranking';
import { formatPoints, formatWinRate } from '@/shared/lib/format-number';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';

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
}: RankingListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasItems = items.length > 0;
  const _currentUserId = items.find((item) => item.isCurrentUser)?.userId;
  const sortedItems = useMemo(() => [...items].sort((a, b) => a.rank - b.rank), [items]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            onLoadMore();
          }
        });
      },
      { rootMargin: '120px' },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

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

      {isLoading && !hasItems ? (
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
      ) : null}

      {!isLoading && !hasItems ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : null}

      {currentUser ? (
        <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-semibold">#{currentUser.rank}</span>
              <Avatar className="h-10 w-10">
                {currentUser.avatarUrl ? (
                  <AvatarImage src={currentUser.avatarUrl} alt={`${currentUser.nickname} 아바타`} />
                ) : null}
                <AvatarFallback>{currentUser.nickname.at(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-semibold leading-tight">{currentUser.nickname}</p>
                <p className="text-muted-foreground text-xs">내 랭킹</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm">
              <p className="font-semibold">{formatPoints(currentUser.points)}</p>
              <p className="text-muted-foreground">{formatWinRate(currentUser.winRate)} 승률</p>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            전적 {currentUser.wins}승 {currentUser.loses}패
          </p>
        </div>
      ) : null}

      {hasItems ? (
        <ul className="flex flex-col gap-3">
          {sortedItems.map((user) => (
            <li
              key={user.userId}
              className={cn(
                'flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition',
                user.isCurrentUser && 'ring-2 ring-primary/40',
              )}
              data-current-user={user.isCurrentUser ? 'true' : 'false'}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center font-semibold">#{user.rank}</span>
                <Avatar className="h-10 w-10">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={`${user.nickname} 아바타`} />
                  ) : null}
                  <AvatarFallback>{user.nickname.at(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold leading-tight">{user.nickname}</p>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span>
                      {user.wins}승 {user.loses}패
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm">
                <p className="font-semibold">{formatPoints(user.points)}</p>
                <p className="text-muted-foreground">{formatWinRate(user.winRate)} 승률</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {hasNextPage ? (
        <div className="flex flex-col items-center gap-2">
          <div ref={loadMoreRef} aria-hidden="true" />
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
