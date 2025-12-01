import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { RankingUser } from '@/entities/ranking/types/ranking';

import { RankingPodium } from './ranking-podium';

const podiumUsers: RankingUser[] = [
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
    isCurrentUser: true,
  },
];

describe('RankingPodium', () => {
  it('상위 3명을 순서대로 렌더링하고 현재 유저에 강조 표시를 준다', () => {
    render(<RankingPodium users={podiumUsers} />);

    expect(screen.getByLabelText('상위 3위 포디움')).toBeInTheDocument();
    expect(screen.getByText('player-01')).toBeInTheDocument();
    expect(screen.getByText('player-02')).toBeInTheDocument();
    expect(screen.getByText('player-03')).toBeInTheDocument();
    expect(screen.getAllByText(/위$/)).toHaveLength(3);
    expect(screen.getByText('player-03').closest('article')).toHaveClass('ring-2');
  });

  it('로딩 시 스켈레톤을 표시한다', () => {
    render(<RankingPodium users={[]} isLoading />);

    const skeletons = screen
      .getAllByLabelText(/상위 3위 포디움/)[0]
      .querySelectorAll('[aria-busy]');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });

  it('에러 시 알림과 다시 시도 버튼을 노출한다', () => {
    const onRetry = vi.fn();
    render(<RankingPodium users={[]} isError onRetry={onRetry} />);

    expect(screen.getByText('랭킹 데이터를 불러오는 중 오류가 발생했습니다.')).toBeInTheDocument();
    screen.getByRole('button', { name: '다시 시도' }).click();
    expect(onRetry).toHaveBeenCalled();
  });
});
