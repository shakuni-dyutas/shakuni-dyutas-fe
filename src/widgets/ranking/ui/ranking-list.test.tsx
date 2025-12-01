import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { RankingUser } from '@/entities/ranking/types/ranking';

import { RankingList } from './ranking-list';

vi.mock('@/widgets/ranking/model/use-ranking-load-more', () => ({
  useRankingLoadMore: () => ({ loadMoreRef: { current: null } }),
}));

const baseItems: RankingUser[] = [
  {
    userId: 'u5',
    rank: 5,
    nickname: 'player-05',
    avatarUrl: null,
    points: 43000,
    wins: 42,
    loses: 24,
    winRate: 63,
    streak: 1,
    isCurrentUser: false,
  },
  {
    userId: 'u4',
    rank: 4,
    nickname: 'player-04',
    avatarUrl: null,
    points: 44000,
    wins: 44,
    loses: 22,
    winRate: 67,
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
];

function renderList(overrides: Partial<React.ComponentProps<typeof RankingList>> = {}) {
  const onLoadMore = vi.fn();
  const onRetry = vi.fn();

  const result = render(
    <RankingList
      anchorId="rankings-list"
      items={baseItems}
      isLoading={false}
      isError={false}
      hasNextPage
      onLoadMore={onLoadMore}
      isFetchingNextPage={false}
      myRank={12}
      currentUser={baseItems[2]}
      loadMoreError={false}
      onRetry={onRetry}
      {...overrides}
    />,
  );

  return { ...result, onLoadMore, onRetry };
}

describe('RankingList', () => {
  it('정렬된 랭킹 리스트와 내 랭킹 카드를 렌더링한다', () => {
    const { container } = renderList();
    const rows = container.querySelectorAll('li');

    expect(rows[0].textContent).toContain('#4');
    expect(rows[1].textContent).toContain('#5');
    expect(screen.getByText('내 랭킹')).toBeInTheDocument();
    expect(screen.getAllByText('#12').length).toBeGreaterThanOrEqual(1);
  });

  it('더 보기 버튼을 클릭하면 onLoadMore를 호출한다', async () => {
    const user = userEvent.setup();
    const { onLoadMore } = renderList();

    await user.click(screen.getByRole('button', { name: '더 보기' }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('loadMoreError가 true이면 오류 메시지를 보여준다', async () => {
    renderList({ loadMoreError: true });

    expect(screen.getByText('다음 페이지를 불러오지 못했어요.')).toBeInTheDocument();
  });

  it('isLoading일 때 스켈레톤을 표시하고 aria-busy를 설정한다', () => {
    renderList({ items: [], isLoading: true, hasNextPage: false });

    const section = screen.getByLabelText('랭킹 목록');
    expect(section.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it('isError일 때 오류 알림과 다시 시도 버튼을 노출한다', async () => {
    const user = userEvent.setup();
    const { onRetry } = renderList({ isError: true });

    expect(screen.getByText('랭킹 목록을 불러오지 못했어요.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('다음 페이지 요청 중이면 버튼을 비활성화하고 로딩 텍스트를 노출한다', () => {
    renderList({ isFetchingNextPage: true });

    const button = screen.getByRole('button', { name: '불러오는 중...' });
    expect(button).toBeDisabled();
  });
});
