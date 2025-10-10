import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AppHeader } from './app-header';

describe('AppHeader', () => {
  test('아이템이 없으면 기본 타이틀을 표시한다', () => {
    render(<AppHeader />);

    expect(screen.getByText('Dyutas')).toBeInTheDocument();
  });

  test('좌/우/중앙 슬롯에 전달된 노드를 렌더링한다', () => {
    render(
      <AppHeader
        leftItems={[
          <button key="left" type="button">
            Left Action
          </button>,
        ]}
        centerItems={[<span key="center">Center Content</span>]}
        rightItems={[
          <button key="right" type="button">
            Right Action
          </button>,
        ]}
      />,
    );

    expect(screen.getByRole('button', { name: 'Left Action' })).toBeInTheDocument();
    expect(screen.getByText('Center Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Right Action' })).toBeInTheDocument();
  });
});
