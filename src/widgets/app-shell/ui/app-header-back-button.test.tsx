import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AppHeaderBackButton } from './app-header-back-button';

const backMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
  }),
}));

describe('AppHeaderBackButton', () => {
  beforeEach(() => {
    backMock.mockReset();
  });

  test('기본으로 router.back을 호출한다', async () => {
    const user = userEvent.setup();

    render(<AppHeaderBackButton />);

    await user.click(screen.getByRole('button', { name: '뒤로가기' }));

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  test('onClick이 제공되면 커스텀 핸들러를 호출하고 router.back은 호출하지 않는다', async () => {
    const user = userEvent.setup();
    const customHandler = vi.fn();

    render(<AppHeaderBackButton onClick={customHandler} />);

    await user.click(screen.getByRole('button', { name: '뒤로가기' }));

    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(backMock).not.toHaveBeenCalled();
  });

  test('disabled가 true면 아무 동작도 하지 않는다', async () => {
    const user = userEvent.setup();
    const customHandler = vi.fn();

    render(<AppHeaderBackButton onClick={customHandler} disabled />);

    await user.click(screen.getByRole('button', { name: '뒤로가기' }));

    expect(customHandler).not.toHaveBeenCalled();
    expect(backMock).not.toHaveBeenCalled();
  });
});
