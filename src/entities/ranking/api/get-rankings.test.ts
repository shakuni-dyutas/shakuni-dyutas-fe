import { describe, expect, it } from 'vitest';

import { getRankings } from './get-rankings';

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
    expect(result.items[0].rank).toBe(6);
  });

  it('search 파라미터를 전달하면 필터링된 결과를 반환한다', async () => {
    const result = await getRankings({ search: 'player-1' });

    expect(result.total).toBeGreaterThan(0);
    expect(
      [...result.podium, ...result.items].some((item) => item.nickname.includes('player-1')),
    ).toBe(true);
  });
});
