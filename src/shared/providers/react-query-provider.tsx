'use client';

import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PropsWithChildren } from 'react';

import { getQueryClient } from '@/shared/lib/react-query';

type ReactQueryProviderProps = PropsWithChildren<{
  client?: QueryClient;
}>;

export function ReactQueryProvider({ children, client }: ReactQueryProviderProps) {
  const queryClient = client ?? getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      ) : null}
    </QueryClientProvider>
  );
}
