import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { AppHeaderActionButton } from './app-header-action-button';

const createIcon = (
  testId: string,
): ComponentType<{ className?: string; 'aria-hidden'?: boolean }> =>
  function Icon({ className }: { className?: string }) {
    return <svg data-testid={testId} className={className} aria-hidden />;
  };

describe('AppHeaderActionButton', () => {
  test('활성 상태에서 onClick을 호출한다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <AppHeaderActionButton icon={createIcon('icon')} ariaLabel="동작 수행" onClick={onClick} />,
    );

    await user.click(screen.getByRole('button', { name: '동작 수행' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('disabled 또는 loading 상태에서는 onClick을 호출하지 않는다', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(
      <AppHeaderActionButton
        icon={createIcon('icon')}
        ariaLabel="동작 수행"
        onClick={onClick}
        disabled
      />,
    );

    await user.click(screen.getByRole('button', { name: '동작 수행' }));
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <AppHeaderActionButton
        icon={createIcon('icon')}
        loadingIcon={createIcon('loading-icon')}
        ariaLabel="동작 수행"
        onClick={onClick}
        loading
      />,
    );

    const button = screen.getByRole('button', { name: '동작 수행' });
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
  });

  test('showLabel이 true이면 label 텍스트를 노출한다', () => {
    render(
      <AppHeaderActionButton
        icon={createIcon('icon')}
        ariaLabel="동작 수행"
        label="텍스트"
        showLabel
      />,
    );

    expect(screen.getByText('텍스트')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '동작 수행' })).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
