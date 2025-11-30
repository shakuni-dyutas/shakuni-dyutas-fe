'use client';

import { useMemo, useState } from 'react';

import type { GetRankingsParams } from '@/entities/ranking/api/get-rankings';
import { useRankings } from '@/entities/ranking/model/use-rankings';
import { RankingsFocusAnchor } from '@/screens/rankings/ui/rankings-focus-anchor';
import { Button } from '@/shared/ui/button';
import { RankingList } from '@/widgets/ranking/ui/ranking-list';
import { RankingPodium } from '@/widgets/ranking/ui/ranking-podium';

const RANKINGS_LIST_ID = 'rankings-list';

function RankingsPage() {
  const [around, _setAround] = useState<GetRankingsParams['around']>();
  const [loadMoreError, setLoadMoreError] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useRankings({
    around,
    limit: 10,
  });

  const podium = useMemo(() => data?.pages?.[0]?.podium ?? [], [data]);
  const listItems = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const myRank = data?.pages?.[0]?.myRank ?? null;
  const currentUser = useMemo(() => {
    const candidates = [...podium, ...listItems];
    return candidates.find((user) => user.isCurrentUser) ?? null;
  }, [listItems, podium]);
  const isInitialLoading = isLoading && !data;

  const handleLoadMore = async () => {
    setLoadMoreError(false);
    try {
      await fetchNextPage({ throwOnError: true });
    } catch (_error) {
      setLoadMoreError(true);
    }
  };

  if (isError && !data) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-6">
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-destructive">
          랭킹 데이터를 불러오는 중 오류가 발생했습니다.
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-6">
      <h1 className="font-semibold text-xl">글로벌 랭킹</h1>

      <RankingPodium
        users={podium}
        isLoading={isInitialLoading}
        isError={false}
        onRetry={refetch}
      />

      <section className="flex flex-col gap-3">
        <RankingsFocusAnchor targetId={RANKINGS_LIST_ID} />
        <RankingList
          anchorId={RANKINGS_LIST_ID}
          items={listItems}
          isLoading={isInitialLoading}
          isError={false}
          onRetry={refetch}
          hasNextPage={hasNextPage}
          onLoadMore={handleLoadMore}
          isFetchingNextPage={isFetchingNextPage}
          myRank={myRank}
          currentUser={currentUser}
          loadMoreError={loadMoreError}
        />
      </section>
    </div>
  );
}

function RankingsPageFallback() {
  return null;
}

export { RANKINGS_LIST_ID, RankingsPage, RankingsPageFallback };
