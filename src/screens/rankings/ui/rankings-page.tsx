'use client';

import { useMemo, useState } from 'react';

import type { GetRankingsParams } from '@/entities/ranking/api/get-rankings';
import { useRankings } from '@/entities/ranking/model/use-rankings';
import { RankingsFocusAnchor } from '@/screens/rankings/ui/rankings-focus-anchor';
import { RankingList } from '@/widgets/ranking/ui/ranking-list';
import { RankingPodium } from '@/widgets/ranking/ui/ranking-podium';

const RANKINGS_LIST_ID = 'rankings-list';

function RankingsPage() {
  const [around, setAround] = useState<GetRankingsParams['around']>();

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

  const _handleMoveToMyRank = () => {
    setAround('me');
    window.location.hash = `#${RANKINGS_LIST_ID}`;
    const anchor = document.getElementById(RANKINGS_LIST_ID);
    setTimeout(() => anchor?.focus({ preventScroll: false }), 0);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-6">
      <h1 className="font-semibold text-xl">글로벌 랭킹</h1>

      <RankingPodium
        users={podium}
        isLoading={isInitialLoading}
        isError={isError}
        onRetry={refetch}
      />

      <section className="flex flex-col gap-3">
        <RankingsFocusAnchor targetId={RANKINGS_LIST_ID} />
        <RankingList
          anchorId={RANKINGS_LIST_ID}
          items={listItems}
          isLoading={isInitialLoading}
          isError={isError}
          onRetry={refetch}
          hasNextPage={hasNextPage}
          onLoadMore={() => fetchNextPage()}
          isFetchingNextPage={isFetchingNextPage}
          myRank={myRank}
          currentUser={currentUser}
        />
      </section>
    </div>
  );
}

function RankingsPageFallback() {
  return null;
}

export { RANKINGS_LIST_ID, RankingsPage, RankingsPageFallback };
