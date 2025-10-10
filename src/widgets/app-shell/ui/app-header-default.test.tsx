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

  test('기본 타이틀과 버튼을 렌더링한다', () => {
    render(<AppHeaderDefault />);

    expect(screen.getByText('Dyutas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '뒤로가기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '검색 열기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '알림 보기' })).toBeInTheDocument();
  });

  test('타이틀과 중앙 아이템을 config로 교체할 수 있다', () => {
    render(
      <AppHeaderDefault
        title={<span>제목</span>}
        items={{
          center: [<span key="center">커스텀 센터</span>],
          right: [
            <button key="extra" type="button">
              추가
            </button>,
          ],
        }}
      />,
    );

    expect(screen.getByText('커스텀 센터')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
  });

  test('액션 config로 버튼 동작을 오버라이드할 수 있다', async () => {
    const user = userEvent.setup();
    const customBack = vi.fn();
    const customSearch = vi.fn();
    const customNotifications = vi.fn();

    render(
      <AppHeaderDefault
        actions={{
          back: { onClick: customBack },
          search: { onClick: customSearch },
          notifications: { onClick: customNotifications },
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: '뒤로가기' }));
    await user.click(screen.getByRole('button', { name: '검색 열기' }));
    await user.click(screen.getByRole('button', { name: '알림 보기' }));

    expect(customBack).toHaveBeenCalledTimes(1);
    expect(backMock).not.toHaveBeenCalled();
    expect(customSearch).toHaveBeenCalledTimes(1);
    expect(customNotifications).toHaveBeenCalledTimes(1);
  });

  test('enabled가 false이면 버튼을 렌더링하지 않는다', () => {
    render(
      <AppHeaderDefault
        actions={{
          back: { enabled: false },
          search: { enabled: false },
          notifications: { enabled: false },
        }}
      />,
    );

    expect(screen.queryByRole('button', { name: '뒤로가기' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '검색 열기' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '알림 보기' })).not.toBeInTheDocument();
  });

  test('로딩 상태에서는 버튼을 비활성화한다', () => {
    render(
      <AppHeaderDefault
        actions={{
          search: { loading: true },
          notifications: { loading: true },
        }}
      />,
    );

    const searchButton = screen.getByRole('button', { name: '검색 열기' });
    const notificationsButton = screen.getByRole('button', { name: '알림 보기' });

    expect(searchButton).toBeDisabled();
    expect(searchButton).toHaveAttribute('aria-busy', 'true');
    expect(notificationsButton).toBeDisabled();
    expect(notificationsButton).toHaveAttribute('aria-busy', 'true');
  });
});
