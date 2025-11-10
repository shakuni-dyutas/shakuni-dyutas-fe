import { describe, expect, it } from 'vitest';

import { createEvidenceFormSchema } from '@/features/evidence-submit/model/evidence-form-schema';

describe('증거 제출 폼 스키마', () => {
  const schema = createEvidenceFormSchema({
    textMaxLength: 300,
    imageMaxCount: 2,
    imageMaxSizeMb: 1,
  });

  it('텍스트 길이 제한을 검증한다', () => {
    const result = schema.safeParse({ summary: '', body: '', images: [] });
    expect(result.success).toBe(false);
    if (result.success) return;
    const { fieldErrors } = result.error.flatten();
    expect(fieldErrors.summary?.[0]).toBe('증거 제목을 입력해 주세요.');
    expect(fieldErrors.body?.[0]).toBe('증거 내용을 입력해 주세요.');
  });

  it('이미지 개수·용량 제한을 검증한다', () => {
    const smallFile = new File(['ok'], 'ok.png', { type: 'image/png' });
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });

    const tooMany = schema.safeParse({
      summary: 'title',
      body: 'body',
      images: [smallFile, smallFile, smallFile],
    });
    expect(tooMany.success).toBe(false);
    if (tooMany.success) return;
    expect(tooMany.error.flatten().fieldErrors.images?.[0]).toContain('최대 2개까지');

    const tooLarge = schema.safeParse({
      summary: 'title',
      body: 'body',
      images: [largeFile],
    });
    expect(tooLarge.success).toBe(false);
    if (tooLarge.success) return;
    expect(tooLarge.error.flatten().fieldErrors.images?.[0]).toContain('1MB');
  });
});
