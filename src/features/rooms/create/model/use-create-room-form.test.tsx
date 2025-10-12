import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import {
  CREATE_ROOM_MAX_FACTION_COUNT,
  CREATE_ROOM_MIN_FACTION_COUNT,
} from './create-room-form-schema';
import { useCreateRoomForm } from './use-create-room-form';

describe('useCreateRoomForm', () => {
  test('기본 진영 개수가 최소 개수와 동일하다', () => {
    const { result } = renderHook(() => useCreateRoomForm());

    expect(result.current.factionFields).toHaveLength(CREATE_ROOM_MIN_FACTION_COUNT);
  });

  test('진영 추가는 최대 개수를 초과하지 않는다', () => {
    const { result } = renderHook(() => useCreateRoomForm());

    act(() => {
      for (
        let i = result.current.factionFields.length;
        i < CREATE_ROOM_MAX_FACTION_COUNT + 2;
        i += 1
      ) {
        result.current.appendFaction();
      }
    });

    expect(result.current.factionFields).toHaveLength(CREATE_ROOM_MAX_FACTION_COUNT);
    expect(result.current.canAppendFaction).toBe(false);
  });

  test('진영 제거는 최소 개수 이하로 내려가지 않는다', () => {
    const { result } = renderHook(() => useCreateRoomForm());

    act(() => {
      result.current.removeFaction(0);
    });

    expect(result.current.factionFields).toHaveLength(CREATE_ROOM_MIN_FACTION_COUNT);
  });

  test('공개/비공개 전환 시 비밀번호 값을 적절히 초기화한다', () => {
    const { result } = renderHook(() => useCreateRoomForm());

    act(() => {
      result.current.setVisibility('private');
      result.current.form.setValue('password', 'abcd1234', { shouldDirty: true });
    });

    expect(result.current.isPrivateRoom).toBe(true);
    expect(result.current.form.getValues('password')).toBe('abcd1234');

    act(() => {
      result.current.setVisibility('public');
    });

    expect(result.current.isPrivateRoom).toBe(false);
    expect(result.current.form.getValues('password')).toBe('');
  });
});
