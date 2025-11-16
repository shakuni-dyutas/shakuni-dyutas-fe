import { useQuery } from '@tanstack/react-query';

import { getTrialHistories } from '@/entities/trial-history/api/get-trial-histories';
import { TRIAL_HISTORY_QUERY_KEYS } from '@/entities/trial-history/model/trial-history-query-keys';
import type { TrialHistoryList } from '@/entities/trial-history/types/trial-history';

import type { GetTrialHistoriesParams } from '../api/get-trial-histories';

const DEFAULT_PARAMS: Required<GetTrialHistoriesParams> = {
  offset: 0,
  limit: 10,
};

function useTrialHistories(params: GetTrialHistoriesParams = {}) {
  const queryParams = {
    ...DEFAULT_PARAMS,
    ...params,
  };

  return useQuery<TrialHistoryList>({
    queryKey: TRIAL_HISTORY_QUERY_KEYS.list(queryParams),
    queryFn: () => getTrialHistories(queryParams),
  });
}

export { useTrialHistories };
