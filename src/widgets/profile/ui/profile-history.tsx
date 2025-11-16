'use client';

import { useEffect, useMemo, useRef } from 'react';

import { useTrialHistories } from '@/entities/trial-history/model/use-trial-histories';
import type { TrialHistoryResult } from '@/entities/trial-history/types/trial-history';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { formatNumber } from '@/widgets/profile/lib/format-number';
import { ProfileHistorySkeleton } from '@/widgets/profile/ui/profile-history.skeleton';

const TRIAL_RESULT_LABEL: Record<TrialHistoryResult, string> = {
  WIN: '승리',
  LOSE: '패배',
};

interface ProfileHistoryProps {
  limit?: number;
  className?: string;
}

function ProfileHistory({ limit = 5, className }: ProfileHistoryProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useTrialHistories({ limit });

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const hasHistory = items.length > 0;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
            fetchNextPage();
          }
        });
      },
      {
        rootMargin: '120px',
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className={cn('mx-auto flex w-full max-w-2xl flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">최근 재판 히스토리</h2>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}>
          새로고침
        </Button>
      </div>

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          재판 히스토리를 불러오는 중 오류가 발생했어요.
        </div>
      ) : null}

      {isLoading && !hasHistory ? <ProfileHistorySkeleton /> : null}

      {!isLoading && !hasHistory ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
          아직 완료된 재판 히스토리가 없어요.
        </div>
      ) : null}

      {hasHistory ? (
        <ul className="space-y-3">
          {items.map((history) => (
            <li key={history.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{history.title}</p>
                <span className="font-semibold text-sm" data-result={history.result}>
                  {TRIAL_RESULT_LABEL[history.result]}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <p className={history.pointDelta >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {history.pointDelta > 0 ? '+' : history.pointDelta < 0 ? '-' : ''}
                  {formatNumber(Math.abs(history.pointDelta))} pt
                </p>
                <p className="text-muted-foreground">
                  {new Date(history.occurredAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div ref={loadMoreRef} aria-hidden="true" />
      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="sr-only"
          >
            더 보기
          </Button>
          {isFetchingNextPage ? (
            <div className="text-center text-muted-foreground text-sm">불러오는 중...</div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export { ProfileHistory };
