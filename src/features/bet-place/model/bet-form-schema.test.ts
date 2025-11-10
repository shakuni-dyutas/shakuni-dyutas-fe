import { describe, expect, it } from 'vitest';

import { createBetFormSchema } from '@/features/bet-place/model/bet-form-schema';

describe('베팅 폼 스키마', () => {
  const schema = createBetFormSchema(500);

  it('진영을 선택하지 않으면 검증에 실패한다', () => {
    const result = schema.safeParse({ factionId: '', points: '600' });

    expect(result.success).toBe(false);
    if (result.success) return;
    const { fieldErrors } = result.error.flatten();
    expect(fieldErrors.factionId?.[0]).toBe('배팅할 진영을 선택해 주세요.');
  });

  it('숫자가 아니거나 최소 포인트 미만이면 거부한다', () => {
    const nonNumeric = schema.safeParse({ factionId: 'faction-a', points: 'abc' });
    expect(nonNumeric.success).toBe(false);
    if (nonNumeric.success) return;
    expect(nonNumeric.error.flatten().fieldErrors.points?.[0]).toBe('배팅 포인트를 입력해 주세요.');

    const belowMinimum = schema.safeParse({ factionId: 'faction-a', points: '100' });
    expect(belowMinimum.success).toBe(false);
    if (belowMinimum.success) return;
    expect(belowMinimum.error.flatten().fieldErrors.points?.[0]).toBe(
      '최소 배팅 포인트는 500 pts 입니다.',
    );
  });
});
