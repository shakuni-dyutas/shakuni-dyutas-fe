'use client';

import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { ReactQueryProvider } from './react-query-provider';

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
      return;
    }

    void import('@/shared/mocks').then(({ enableMocking }) => enableMocking());
  }, []);

  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
