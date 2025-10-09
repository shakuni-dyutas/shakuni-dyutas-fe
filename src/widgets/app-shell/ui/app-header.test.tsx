import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AppHeader } from './app-header';

describe('AppHeader', () => {
  test('슬롯이 없으면 기본 타이틀을 표시한다', () => {
    render(<AppHeader />);

    expect(screen.getByText('Shakuni Dyutas')).toBeInTheDocument();
  });

  test('좌/우/중앙 슬롯을 렌더링한다', () => {
    render(
      <AppHeader
        leftSlot={<button type="button">Left Action</button>}
        centerSlot={<span>Center Content</span>}
        rightSlot={<button type="button">Right Action</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Left Action' })).toBeInTheDocument();
    expect(screen.getByText('Center Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Right Action' })).toBeInTheDocument();
  });

  test('logoSlot을 전달하면 centerSlot 대체로 사용한다', () => {
    render(<AppHeader logoSlot={<span>Logo Slot</span>} rightSlot={<span>Right</span>} />);

    expect(screen.getByText('Logo Slot')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });
});
