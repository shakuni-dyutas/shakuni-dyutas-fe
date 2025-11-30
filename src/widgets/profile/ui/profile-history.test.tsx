import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

type TrialHistoryPage = {
  items: {
    id: string;
    title: string;
    result: 'WIN' | 'LOSE';
    pointDelta: number;
    occurredAt: string;
  }[];
  total: number;
  nextOffset: number | null;
  hasMore: boolean;
  offset: number;
  limit: number;
};

type TrialHistoryHookResult = {
  data?: {
    pages: TrialHistoryPage[];
    pageParams: number[];
  };
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
};

const mockUseTrialHistories = vi.hoisted(() =>
  vi.fn<() => TrialHistoryHookResult>(() => ({
    data: {
      pages: [
        {
          items: [
            {
              id: 'history-1',
              title: '모의재판 #1 - 투자 분쟁',
              result: 'WIN',
              pointDelta: 1500,
              occurredAt: new Date('2025-11-10T10:00:00Z').toISOString(),
            },
          ],
          total: 1,
          nextOffset: null,
          hasMore: false,
          offset: 0,
          limit: 5,
        },
      ],
      pageParams: [0],
    },
    isLoading: false,
    isError: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: vi.fn(),
  })),
);

vi.mock('@/entities/trial-history/model/use-trial-histories', () => ({
  useTrialHistories: mockUseTrialHistories,
}));

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn();
}

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    IntersectionObserverMock as unknown as typeof IntersectionObserver,
  );
});

import { ProfileHistory } from './profile-history';

describe('ProfileHistory', () => {
  test('히스토리를 렌더링한다', async () => {
    render(<ProfileHistory limit={2} />);

    expect(await screen.findByText('모의재판 #1 - 투자 분쟁')).toBeInTheDocument();
  });

  test('에러 발생 시 메시지를 표시한다', () => {
    mockUseTrialHistories.mockReturnValueOnce({
      data: {
        pages: [],
        pageParams: [],
      },
      isLoading: false,
      isError: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
    });

    render(<ProfileHistory />);

    expect(screen.getByText('재판 히스토리를 불러오는 중 오류가 발생했어요.')).toBeInTheDocument();
  });
});
