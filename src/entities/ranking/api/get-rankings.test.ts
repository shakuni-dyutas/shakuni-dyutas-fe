import { HttpResponse, http } from 'msw';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/shared/mocks/server';

let getRankings: typeof import('./get-rankings')['getRankings'];

beforeAll(async () => {
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
  process.env.NEXT_PUBLIC_API_MOCKING = 'disabled';
  ({ getRankings } = await import('./get-rankings'));
});

const mockItems = Array.from({ length: 15 }).map((_, index) => {
  const rank = index + 1;
  return {
    userId: `u-${rank}`,
    rank,
    nickname: `player-${String(rank).padStart(2, '0')}`,
    avatarUrl: null,
    points: 50000 - rank * 100,
    wins: 60 - rank,
    loses: 15 + rank,
    winRate: 80 - rank,
    streak: 2,
    isCurrentUser: rank === 12,
  };
});

beforeEach(() => {
  server.use(
    http.get('*/rankings', ({ request }) => {
      const url = new URL(request.url);
      const offset = Number(url.searchParams.get('offset') ?? '0');
      const limit = Number(url.searchParams.get('limit') ?? '20');
      const podium = mockItems.slice(0, 3);
      const slice = mockItems.slice(Math.max(3, offset), Math.max(3, offset) + limit);
      const nextOffset =
        Math.max(3, offset) + limit < mockItems.length ? Math.max(3, offset) + limit : null;

      return HttpResponse.json({
        podium,
        items: slice,
        total: mockItems.length,
        nextOffset,
        myRank: mockItems.find((item) => item.isCurrentUser)?.rank ?? null,
      });
    }),
  );
});

describe('getRankings', () => {
  it('기본 파라미터로 랭킹 목록과 포디움 데이터를 반환한다', async () => {
    const result = await getRankings();

    expect(result.offset).toBe(0);
    expect(result.limit).toBe(20);
    expect(result.podium).toHaveLength(3);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.podium[0].rank).toBe(1);
    expect(result.myRank).toBeGreaterThan(0);
  });

  it('offset/limit 파라미터를 적용해 리스트를 슬라이스한다', async () => {
    const result = await getRankings({ offset: 2, limit: 5 });

    expect(result.offset).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.items).toHaveLength(5);
    expect(result.items[0].rank).toBe(4);
  });
});
