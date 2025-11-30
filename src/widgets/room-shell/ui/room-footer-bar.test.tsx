import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { RoomFooterBar } from './room-footer-bar';

describe('RoomFooterBar', () => {
  test('종료된 상태에서는 입력과 제출이 비활성화되고 결과 확인 CTA가 노출된다', () => {
    const onResultClick = vi.fn();
    const onSubmit = vi.fn();

    const { container } = render(
      <RoomFooterBar
        isEnded
        onResultClick={onResultClick}
        onSubmit={onSubmit}
        onBetClick={vi.fn()}
        onEvidenceClick={vi.fn()}
      />,
    );

    expect(screen.getByText('결과 확인')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('종료된 재판입니다.') as HTMLInputElement;
    expect(input).toBeDisabled();

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('결과 확인'));
    expect(onResultClick).toHaveBeenCalledTimes(1);
  });
});
