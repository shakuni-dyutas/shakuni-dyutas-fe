'use client';

import { useMemo } from 'react';

import { useTrialHistories } from '@/entities/trial-history/model/use-trial-histories';
import type { TrialHistoryResult } from '@/entities/trial-history/types/trial-history';
import { Button } from '@/shared/ui/button';

const TRIAL_RESULT_LABEL: Record<TrialHistoryResult, string> = {
  WIN: '승리',
  LOSE: '패배',
};

function ProfileHistory() {
  const {
    data: trialHistory,
    isLoading,
    isError,
    refetch,
  } = useTrialHistories({
    limit: 5,
  });

  const hasHistory = useMemo(() => (trialHistory?.items.length ?? 0) > 0, [trialHistory]);

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
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

      {isLoading ? (
        <div className="space-y-3 rounded-xl border p-4">
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
        </div>
      ) : null}

      {!isLoading && !hasHistory ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
          아직 완료된 재판 히스토리가 없어요.
        </div>
      ) : null}

      {!isLoading && hasHistory ? (
        <ul className="space-y-3">
          {trialHistory?.items.map((history) => (
            <li key={history.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{history.title}</p>
                <span className="font-semibold text-sm" data-result={history.result}>
                  {TRIAL_RESULT_LABEL[history.result]}
                </span>
              </div>
              <dl className="mt-2 text-muted-foreground text-sm">
                <div className="flex items-center justify-between">
                  <dt>포인트</dt>
                  <dd className={history.pointDelta >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {history.pointDelta >= 0 ? '+' : ''}
                    {history.pointDelta} pt
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>날짜</dt>
                  <dd>{new Date(history.occurredAt).toLocaleString()}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export { ProfileHistory };
