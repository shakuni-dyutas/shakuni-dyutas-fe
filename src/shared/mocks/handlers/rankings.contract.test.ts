import { describe, expect, it } from 'vitest';

import { getRankings } from '@/entities/ranking/api/get-rankings';

describe('rankingHandlers', () => {
  it('nextOffset/hasMore 일관성과 필수 필드 반환을 보장한다', async () => {
    const first = await getRankings({ offset: 0, limit: 10 });

    expect(first.podium).toHaveLength(3);
    expect(first.items.length).toBeGreaterThan(0);
    expect(first.hasMore).toBe(first.nextOffset !== null);

    const nextOffset = first.nextOffset ?? 0;
    const second = await getRankings({ offset: nextOffset, limit: 10 });

    expect(second.offset).toBe(nextOffset);
    expect(second.hasMore).toBe(second.nextOffset !== null);
  });
});
