import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { CreateRoomCTA } from './create-room-cta';

const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
};

describe('CreateRoomCTA', () => {
  beforeEach(() => {
    setScrollY(0);
  });

  test('최상단에서는 CTA가 표시되고 클릭 이벤트가 호출된다', async () => {
    const onCreateRoomClick = vi.fn();
    const user = userEvent.setup();

    render(<CreateRoomCTA onCreateRoomClick={onCreateRoomClick} />);

    const button = screen.getByRole('button', { name: '새 방 만들기' });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(onCreateRoomClick).toHaveBeenCalledTimes(1);
  });

  test('스크롤이 내려가면 CTA가 숨겨지고 다시 올리면 나타난다', async () => {
    render(<CreateRoomCTA />);

    const container = screen.getByLabelText('방 생성 안내');
    expect(container).toHaveStyle({ pointerEvents: 'auto' });

    setScrollY(200);
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(container).toHaveStyle({ pointerEvents: 'none' });
    });

    setScrollY(120);
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(container).toHaveStyle({ pointerEvents: 'auto' });
    });
  });
});
