import type { DefaultOptions, QueryClientConfig } from '@tanstack/react-query';

export const reactQueryDefaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  },
  mutations: {
    retry: 1,
  },
};

export const reactQueryClientConfig: QueryClientConfig = {
  defaultOptions: reactQueryDefaultOptions,
};
