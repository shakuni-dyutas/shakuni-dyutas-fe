import { describe, expect, test } from 'vitest';

import {
  CREATE_ROOM_MAX_FACTION_COUNT,
  CREATE_ROOM_MIN_FACTION_COUNT,
  createRoomFormSchema,
} from './create-room-form-schema';

describe('createRoomFormSchema', () => {
  const baseInput = {
    title: '방 제목',
    description: '방 설명입니다.',
    timeLimitMinutes: '30',
    minBetPoint: '100',
    factions: Array.from({ length: CREATE_ROOM_MIN_FACTION_COUNT }, (_, index) => ({
      title: `진영 ${index + 1}`,
      description: '설명',
    })),
  };

  test('유효한 폼 값은 검증을 통과한다', () => {
    const result = createRoomFormSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  test('제목을 입력하지 않으면 오류를 반환한다', () => {
    const result = createRoomFormSchema.safeParse({ ...baseInput, title: '   ' });

    expect(result.success).toBe(false);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      expect(fieldErrors.title).toContain('방 제목을 입력해 주세요.');
    }
  });

  test('진영이 최소 개수보다 적으면 오류를 반환한다', () => {
    const result = createRoomFormSchema.safeParse({
      ...baseInput,
      factions: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      expect(fieldErrors.factions).toContain(
        `진영은 최소 ${CREATE_ROOM_MIN_FACTION_COUNT}개 이상이어야 합니다.`,
      );
    }
  });

  test('진영이 최대 개수를 초과하면 오류를 반환한다', () => {
    const result = createRoomFormSchema.safeParse({
      ...baseInput,
      factions: Array.from({ length: CREATE_ROOM_MAX_FACTION_COUNT + 1 }, (_, index) => ({
        title: `진영 ${index + 1}`,
        description: '설명',
      })),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      expect(fieldErrors.factions).toContain(
        `진영은 최대 ${CREATE_ROOM_MAX_FACTION_COUNT}개까지 추가할 수 있습니다.`,
      );
    }
  });
});
