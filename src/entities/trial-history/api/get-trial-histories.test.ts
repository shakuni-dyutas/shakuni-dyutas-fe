import { describe, expect, it } from 'vitest';

import { getTrialHistories } from './get-trial-histories';

describe('getTrialHistories', () => {
  it('기본 파라미터로 히스토리 목록을 반환한다', async () => {
    const result = await getTrialHistories();

    expect(result.offset).toBe(0);
    expect(result.limit).toBe(10);
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].id).toBe('trial-history-001');
  });

  it('offset/limit 파라미터를 적용한다', async () => {
    const result = await getTrialHistories({ offset: 2, limit: 2 });

    expect(result.offset).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe('trial-history-003');
  });
});
