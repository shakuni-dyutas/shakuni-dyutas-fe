import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ProfileHistory } from './profile-history';

type TrialHistoryHookResult = {
  data:
    | {
        items: {
          id: string;
          title: string;
          result: 'WIN' | 'LOSE';
          pointDelta: number;
          occurredAt: string;
        }[];
        total: number;
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

const mockUseTrialHistories = vi.hoisted(() =>
  vi.fn<() => TrialHistoryHookResult>(() => ({
    data: {
      items: [
        {
          id: 'history-1',
          title: '모의재판 #1 - 투자 분쟁',
          result: 'WIN',
          pointDelta: 1500,
          occurredAt: new Date('2025-11-10T10:00:00Z').toISOString(),
        },
      ],
      total: 1,
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  })),
);

vi.mock('@/entities/trial-history/model/use-trial-histories', () => ({
  useTrialHistories: mockUseTrialHistories,
}));

describe('ProfileHistory', () => {
  test('히스토리를 렌더링한다', async () => {
    render(<ProfileHistory limit={2} />);

    expect(await screen.findByText('모의재판 #1 - 투자 분쟁')).toBeInTheDocument();
  });

  test('에러 발생 시 메시지를 표시한다', () => {
    mockUseTrialHistories.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<ProfileHistory />);

    expect(screen.getByText('재판 히스토리를 불러오는 중 오류가 발생했어요.')).toBeInTheDocument();
  });
});
