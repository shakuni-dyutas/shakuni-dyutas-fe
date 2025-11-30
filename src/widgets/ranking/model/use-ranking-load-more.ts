'use client';

import { useEffect, useRef } from 'react';

interface UseRankingLoadMoreParams {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  enabled?: boolean;
}

function useRankingLoadMore({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  enabled = true,
}: UseRankingLoadMoreParams) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!enabled || !hasNextPage || isFetchingNextPage) {
            return;
          }

          if (entry.isIntersecting) {
            onLoadMore();
          }
        });
      },
      { rootMargin: '120px' },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, hasNextPage, isFetchingNextPage, onLoadMore]);

  return { loadMoreRef };
}

export { useRankingLoadMore };
