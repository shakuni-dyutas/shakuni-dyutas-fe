type TrialHistoryResult = 'WIN' | 'LOSE';

interface TrialHistory {
  id: string;
  title: string;
  result: TrialHistoryResult;
  pointDelta: number;
  occurredAt: string;
}

interface TrialHistoryList {
  items: TrialHistory[];
  total: number;
  offset: number;
  limit: number;
}

export type { TrialHistory, TrialHistoryList, TrialHistoryResult };
