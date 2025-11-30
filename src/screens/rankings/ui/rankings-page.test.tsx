import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GetRankingsParams } from '@/entities/ranking/api/get-rankings';
import type { RankingList } from '@/entities/ranking/types/ranking';

import { RankingsPage } from './rankings-page';

type UseRankingsParams = GetRankingsParams & {
  limit?: number;
};

const mockFetchNextPage = vi.fn();
const mockRefetch = vi.fn();
const mockUseRankings = vi.fn();
class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn();
}

vi.mock('@/entities/ranking/model/use-rankings', () => ({
  useRankings: (params: UseRankingsParams = {}) => mockUseRankings(params),
}));

const baseResponse: RankingList = {
  podium: [
    {
      userId: 'u1',
      rank: 1,
      nickname: 'player-01',
      avatarUrl: null,
      points: 50000,
      wins: 60,
      loses: 15,
      winRate: 80,
      streak: 3,
      isCurrentUser: false,
    },
    {
      userId: 'u2',
      rank: 2,
      nickname: 'player-02',
      avatarUrl: null,
      points: 48000,
      wins: 55,
      loses: 18,
      winRate: 75,
      streak: 2,
      isCurrentUser: false,
    },
    {
      userId: 'u3',
      rank: 3,
      nickname: 'player-03',
      avatarUrl: null,
      points: 47000,
      wins: 52,
      loses: 20,
      winRate: 72,
      streak: 1,
      isCurrentUser: false,
    },
  ],
  items: [
    {
      userId: 'u4',
      rank: 4,
      nickname: 'player-04',
      avatarUrl: null,
      points: 46000,
      wins: 50,
      loses: 22,
      winRate: 70,
      streak: 1,
      isCurrentUser: false,
    },
    {
      userId: 'me',
      rank: 12,
      nickname: 'Dyutas Player',
      avatarUrl: null,
      points: 40000,
      wins: 45,
      loses: 30,
      winRate: 60,
      streak: 2,
      isCurrentUser: true,
    },
  ],
  total: 30,
  nextOffset: 10,
  hasMore: true,
  offset: 0,
  limit: 10,
  myRank: 12,
};

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    IntersectionObserverMock as unknown as typeof IntersectionObserver,
  );
  mockFetchNextPage.mockReset();
  mockRefetch.mockReset();
  mockUseRankings.mockReset();
  mockUseRankings.mockReturnValue({
    data: {
      pages: [baseResponse],
      pageParams: [0],
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    fetchNextPage: mockFetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    refetch: mockRefetch,
  });
});

describe('RankingsPage', () => {
  it('포디움과 랭킹 리스트를 렌더링한다', async () => {
    render(<RankingsPage />);

    expect(screen.getByText('player-01')).toBeInTheDocument();
    expect(screen.getByText('player-04')).toBeInTheDocument();
    expect(mockUseRankings).toHaveBeenCalledWith(
      expect.objectContaining({ around: undefined, limit: 10 }),
    );
    expect(screen.getByText('내 랭킹')).toBeInTheDocument();
    expect(screen.getAllByText('#12')[0]).toBeInTheDocument();
  });

  it('더 보기 버튼 클릭 시 다음 페이지를 요청한다', async () => {
    const user = userEvent.setup();
    render(<RankingsPage />);

    await user.click(screen.getByRole('button', { name: /더 보기/ }));

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });
});
