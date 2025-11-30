'use client';

import { useEffect } from 'react';

interface RankingsFocusAnchorProps {
  targetId: string;
}

function RankingsFocusAnchor({ targetId }: RankingsFocusAnchorProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.location.hash !== `#${targetId}`) {
      return;
    }

    const target = document.getElementById(targetId);

    target?.focus({ preventScroll: false });
  }, [targetId]);

  return null;
}

export { RankingsFocusAnchor };
