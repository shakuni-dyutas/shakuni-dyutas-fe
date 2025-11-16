import { HttpResponse, http } from 'msw';

type TrialHistoryMock = {
  id: string;
  title: string;
  result: 'WIN' | 'LOSE';
  pointDelta: number;
  occurredAt: string;
};

const TRIAL_HISTORY_COLLECTION: TrialHistoryMock[] = Array.from({ length: 20 }).map((_, index) => {
  const id = index + 1;
  return {
    id: `trial-history-${String(id).padStart(3, '0')}`,
    title: `모의재판 #${id} - 사례 ${id}`,
    result: id % 2 === 0 ? 'LOSE' : 'WIN',
    pointDelta: id % 2 === 0 ? -500 - id * 10 : 2000 + id * 20,
    occurredAt: new Date(Date.UTC(2025, 10, 10 - index, 10, 0, 0)).toISOString(),
  } satisfies TrialHistoryMock;
});

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

  const slice = TRIAL_HISTORY_COLLECTION.slice(offset, offset + limit);
  const nextOffset = offset + limit < TRIAL_HISTORY_COLLECTION.length ? offset + limit : null;

  return HttpResponse.json({
    items: slice,
    total: TRIAL_HISTORY_COLLECTION.length,
    nextOffset,
  });
}

const trialHistoriesHandlers = [http.get('*/profile/trial-histories', handleGetTrialHistories)];

export { buildTrialHistoryMock, trialHistoriesHandlers };
