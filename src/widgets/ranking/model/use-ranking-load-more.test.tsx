import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useRankingLoadMore } from './use-ranking-load-more';

const observe = vi.fn();
const disconnect = vi.fn();

let mockCallback: IntersectionObserverCallback | null = null;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  constructor(callback: IntersectionObserverCallback) {
    mockCallback = callback;
  }
  disconnect = disconnect;
  observe = observe;
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {
    return;
  }
}

describe('useRankingLoadMore', () => {
  beforeEach(() => {
    observe.mockReset();
    disconnect.mockReset();
    mockCallback = null;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  });

  it('교차 시 onLoadMore를 호출한다', () => {
    const onLoadMore = vi.fn();
    function TestComponent() {
      const { loadMoreRef } = useRankingLoadMore({
        hasNextPage: true,
        isFetchingNextPage: false,
        onLoadMore,
      });
      return <div ref={loadMoreRef} data-testid="sentinel" />;
    }

    const { getByTestId } = render(<TestComponent />);
    expect(observe).toHaveBeenCalledWith(getByTestId('sentinel'));

    mockCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('enabled=false이면 호출하지 않는다', () => {
    const onLoadMore = vi.fn();
    function TestComponent() {
      const { loadMoreRef } = useRankingLoadMore({
        hasNextPage: true,
        isFetchingNextPage: false,
        onLoadMore,
        enabled: false,
      });
      return <div ref={loadMoreRef} data-testid="sentinel" />;
    }

    render(<TestComponent />);
    mockCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
