import type { GetTrialHistoriesParams } from '@/entities/trial-history/api/get-trial-histories';

const TRIAL_HISTORY_QUERY_KEYS = {
  all: ['trial-histories'] as const,
  list: (params: GetTrialHistoriesParams = {}) =>
    [...TRIAL_HISTORY_QUERY_KEYS.all, params] as const,
};

export { TRIAL_HISTORY_QUERY_KEYS };
