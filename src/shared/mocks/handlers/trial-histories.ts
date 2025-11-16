import { HttpResponse, http } from 'msw';

type TrialHistoryMock = {
  id: string;
  title: string;
  result: 'WIN' | 'LOSE';
  pointDelta: number;
  occurredAt: string;
};

const TRIAL_HISTORY_COLLECTION: TrialHistoryMock[] = [
  {
    id: 'trial-history-001',
    title: '모의재판 #1 - 투자 분쟁',
    result: 'WIN',
    pointDelta: 2500,
    occurredAt: new Date('2025-11-10T10:00:00Z').toISOString(),
  },
  {
    id: 'trial-history-002',
    title: '모의재판 #2 - 특허 침해',
    result: 'LOSE',
    pointDelta: -1200,
    occurredAt: new Date('2025-11-08T08:00:00Z').toISOString(),
  },
  {
    id: 'trial-history-003',
    title: '모의재판 #3 - 계약 분쟁',
    result: 'WIN',
    pointDelta: 4300,
    occurredAt: new Date('2025-11-05T09:30:00Z').toISOString(),
  },
  {
    id: 'trial-history-004',
    title: '모의재판 #4 - 손해배상',
    result: 'LOSE',
    pointDelta: -800,
    occurredAt: new Date('2025-11-03T14:00:00Z').toISOString(),
  },
  {
    id: 'trial-history-005',
    title: '모의재판 #5 - 세금 조정',
    result: 'WIN',
    pointDelta: 1500,
    occurredAt: new Date('2025-10-30T12:15:00Z').toISOString(),
  },
  {
    id: 'trial-history-006',
    title: '모의재판 #6 - 부동산 분쟁',
    result: 'LOSE',
    pointDelta: -600,
    occurredAt: new Date('2025-10-27T16:45:00Z').toISOString(),
  },
];

function buildTrialHistoryMock(overrides: Partial<TrialHistoryMock> = {}): TrialHistoryMock {
  const index = TRIAL_HISTORY_COLLECTION.length + 1;
  const base: TrialHistoryMock = {
    id: `trial-history-${String(index).padStart(3, '0')}`,
    title: `모의재판 #${index}`,
    result: index % 2 === 0 ? 'LOSE' : 'WIN',
    pointDelta: index % 2 === 0 ? -1000 : 1000,
    occurredAt: new Date().toISOString(),
  };

  return {
    ...base,
    ...overrides,
  };
}

function parseNumber(value: string | null, fallback: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

async function handleGetTrialHistories({ request }: { request: Request }) {
  const url = new URL(request.url);
  const offset = parseNumber(url.searchParams.get('offset'), 0);
  const limit = parseNumber(url.searchParams.get('limit'), 10);

  const items = TRIAL_HISTORY_COLLECTION.slice(offset, offset + limit);

  return HttpResponse.json({
    items,
    total: TRIAL_HISTORY_COLLECTION.length,
  });
}

const trialHistoriesHandlers = [http.get('*/profile/trial-histories', handleGetTrialHistories)];

export { buildTrialHistoryMock, trialHistoriesHandlers };
