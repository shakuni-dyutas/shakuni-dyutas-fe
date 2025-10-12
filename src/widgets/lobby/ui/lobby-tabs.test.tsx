import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { LobbyTabs } from './lobby-tabs';

describe('LobbyTabs', () => {
  test('탭 트리거를 렌더링하고 현재 탭을 표시한다', () => {
    render(<LobbyTabs value="active" onValueChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('button', { name: 'Hot' })).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByRole('button', { name: 'New' })).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByRole('button', { name: 'Ended' })).toHaveAttribute('data-state', 'inactive');
  });

  test('탭 클릭 시 onValueChange가 호출된다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<LobbyTabs value="active" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Hot' }));
    expect(onValueChange).toHaveBeenCalledWith('hot');

    await user.click(screen.getByRole('button', { name: 'New' }));
    expect(onValueChange).toHaveBeenCalledWith('new');

    await user.click(screen.getByRole('button', { name: 'Ended' }));
    expect(onValueChange).toHaveBeenCalledWith('ended');
  });
});


