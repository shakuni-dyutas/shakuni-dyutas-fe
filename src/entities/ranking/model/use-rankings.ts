import { useInfiniteQuery } from '@tanstack/react-query';

import { getRankings } from '@/entities/ranking/api/get-rankings';
import { RANKING_QUERY_KEYS } from '@/entities/ranking/model/ranking-query-keys';
import type { RankingList } from '@/entities/ranking/types/ranking';

import type { GetRankingsParams } from '../api/get-rankings';

const DEFAULT_PARAMS = {
  offset: 0,
  limit: 20,
} satisfies Pick<GetRankingsParams, 'offset' | 'limit'>;

function useRankings(params: GetRankingsParams = {}) {
  const queryParams: GetRankingsParams = {
    ...DEFAULT_PARAMS,
    ...params,
  };

  return useInfiniteQuery<RankingList>({
    queryKey: RANKING_QUERY_KEYS.list(queryParams),
    queryFn: ({ pageParam }) =>
      getRankings({
        ...queryParams,
        offset: typeof pageParam === 'number' ? pageParam : queryParams.offset,
      }),
    initialPageParam: queryParams.offset,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextOffset ?? undefined) : undefined,
    retry: 0,
  });
}

export { useRankings };
