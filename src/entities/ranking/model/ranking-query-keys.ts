import type { GetRankingsParams } from '@/entities/ranking/api/get-rankings';

const RANKING_QUERY_KEYS = {
  all: ['rankings'] as const,
  list: (params: GetRankingsParams = {}) => [...RANKING_QUERY_KEYS.all, params] as const,
};

export { RANKING_QUERY_KEYS };
