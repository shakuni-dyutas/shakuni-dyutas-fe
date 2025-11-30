import { apiClient } from '@/shared/api/api-client';

import type { RankingList, RankingUser } from '../types/ranking';

type RankingUserResponse = {
  userId: string;
  rank: number;
  nickname: string;
  avatarUrl: string | null;
  points: number;
  wins: number;
  loses: number;
  winRate: number;
  streak: number;
  isCurrentUser: boolean;
};

type RankingsResponse = {
  podium: RankingUserResponse[];
  items: RankingUserResponse[];
  total: number;
  nextOffset: number | null;
  myRank: number | null;
};

type GetRankingsParams = {
  offset?: number;
  limit?: number;
  search?: string;
  around?: 'me';
};

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 20;
const DEFAULT_SEARCH = '';

function mapRankingUser(response: RankingUserResponse): RankingUser {
  return {
    userId: response.userId,
    rank: response.rank,
    nickname: response.nickname,
    avatarUrl: response.avatarUrl,
    points: response.points,
    wins: response.wins,
    loses: response.loses,
    winRate: response.winRate,
    streak: response.streak,
    isCurrentUser: response.isCurrentUser,
  };
}

async function getRankings(params: GetRankingsParams = {}): Promise<RankingList> {
  const offset = params.offset ?? DEFAULT_OFFSET;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const search = params.search ?? DEFAULT_SEARCH;
  const around = params.around;

  const searchParams: Record<string, string> = {
    offset: String(offset),
    limit: String(limit),
  };

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    searchParams.search = trimmedSearch;
  }

  if (around) {
    searchParams.around = around;
  }

  const response = await apiClient
    .get('rankings', {
      searchParams,
    })
    .json<RankingsResponse>();

  return {
    podium: response.podium.map(mapRankingUser),
    items: response.items.map(mapRankingUser),
    total: response.total,
    nextOffset: response.nextOffset,
    hasMore: response.nextOffset !== null,
    offset,
    limit,
    myRank: response.myRank ?? null,
  };
}

export type { GetRankingsParams };
export { getRankings };
