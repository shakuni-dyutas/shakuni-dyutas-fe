import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AppHeaderDefault } from './app-header-default';

const backMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
  }),
}));

describe('AppHeaderDefault', () => {
  beforeEach(() => {
    backMock.mockReset();
  });

  test('뒤로가기 핸들러가 전달되면 이를 호출하고 기본 history 호출은 하지 않는다', async () => {
    const user = userEvent.setup();
    const onBackClick = vi.fn();

    render(<AppHeaderDefault onBackClick={onBackClick} centerSlot={<span>Title</span>} />);

    const backButton = screen.getByRole('button', { name: '뒤로가기' });
    await user.click(backButton);

    expect(onBackClick).toHaveBeenCalledTimes(1);
    expect(backMock).not.toHaveBeenCalled();
  });

  test('뒤로가기 핸들러가 없으면 router.back을 호출한다', async () => {
    const user = userEvent.setup();

    render(<AppHeaderDefault />);

    const backButton = screen.getByRole('button', { name: '뒤로가기' });
    await user.click(backButton);

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  test('검색과 알림 버튼이 클릭되면 콜백을 실행한다', async () => {
    const user = userEvent.setup();
    const onSearchClick = vi.fn();
    const onNotificationsClick = vi.fn();

    render(
      <AppHeaderDefault
        onSearchClick={onSearchClick}
        onNotificationsClick={onNotificationsClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: '검색 열기' }));
    await user.click(screen.getByRole('button', { name: '알림 보기' }));

    expect(onSearchClick).toHaveBeenCalledTimes(1);
    expect(onNotificationsClick).toHaveBeenCalledTimes(1);
  });

  test('로딩 상태에서는 버튼을 비활성화하고 스피너를 노출한다', () => {
    render(
      <AppHeaderDefault isSearchLoading isNotificationsLoading centerSlot={<span>Title</span>} />,
    );

    const searchButton = screen.getByRole('button', { name: '검색 열기' });
    const notificationsButton = screen.getByRole('button', { name: '알림 보기' });

    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveAttribute('aria-busy', 'true');
    expect(searchButton.querySelector('svg')).toHaveClass('animate-spin');

    expect(notificationsButton).toBeDisabled();
    expect(notificationsButton).toHaveAttribute('aria-busy', 'true');
    expect(notificationsButton.querySelector('svg')).toHaveClass('animate-spin');
  });

  test('rightAccessorySlot을 추가로 렌더링한다', () => {
    render(<AppHeaderDefault rightAccessorySlot={<button type="button">추가 버튼</button>} />);

    expect(screen.getByRole('button', { name: '추가 버튼' })).toBeInTheDocument();
  });
});
