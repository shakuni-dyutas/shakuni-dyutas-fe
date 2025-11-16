import { apiClient } from '@/shared/api/api-client';

import type { TrialHistory, TrialHistoryList, TrialHistoryResult } from '../types/trial-history';

type TrialHistoryResponse = {
  id: string;
  title: string;
  result: TrialHistoryResult;
  pointDelta: number;
  occurredAt: string;
};

type TrialHistoryListResponse = {
  items: TrialHistoryResponse[];
  total: number;
};

type GetTrialHistoriesParams = {
  offset?: number;
  limit?: number;
};

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

function mapTrialHistory(response: TrialHistoryResponse): TrialHistory {
  return {
    id: response.id,
    title: response.title,
    result: response.result,
    pointDelta: response.pointDelta,
    occurredAt: response.occurredAt,
  };
}

async function getTrialHistories(params: GetTrialHistoriesParams = {}): Promise<TrialHistoryList> {
  const offset = params.offset ?? DEFAULT_OFFSET;
  const limit = params.limit ?? DEFAULT_LIMIT;

  const response = await apiClient
    .get('profile/trial-histories', {
      searchParams: {
        offset: String(offset),
        limit: String(limit),
      },
    })
    .json<TrialHistoryListResponse>();

  return {
    items: response.items.map(mapTrialHistory),
    total: response.total,
    offset,
    limit,
  };
}

export type { GetTrialHistoriesParams };
export { getTrialHistories };
