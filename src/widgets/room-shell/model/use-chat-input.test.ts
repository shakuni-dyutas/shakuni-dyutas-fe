import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useChatInput } from '@/widgets/room-shell/model/use-chat-input';

describe('useChatInput', () => {
  it('빈 메시지는 전송하지 않는다', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useChatInput({ maxLength: 10, onSubmit }));

    act(() => {
      result.current.handleSubmit();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.error).toBe('메시지를 입력해 주세요.');
  });

  it('최대 길이를 초과하면 입력을 막는다', () => {
    const { result } = renderHook(() => useChatInput({ maxLength: 5 }));

    act(() => {
      result.current.handleChange('hello');
    });
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.handleChange('hellooo');
    });

    expect(result.current.error).toBe('메시지는 5자 이하로 입력해 주세요.');
    expect(result.current.value).toBe('hello');
  });

  it('양 끝 공백을 제거한 뒤 전송한다', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useChatInput({ maxLength: 20, onSubmit }));

    act(() => {
      result.current.handleChange('  hi  ');
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith('hi');
    expect(result.current.value).toBe('');
  });

  it('조합 중 Enter는 무시한다', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useChatInput({ maxLength: 20, onSubmit }));

    act(() => {
      result.current.handleChange('ㅋ');
      result.current.handleCompositionStart();
    });

    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        shiftKey: false,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent<HTMLInputElement>);
      result.current.handleCompositionEnd();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
