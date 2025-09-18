import { QueryClient } from '@tanstack/react-query';

import { reactQueryClientConfig } from '@/shared/config/react-query';

let browserQueryClient: QueryClient | null = null;

export function createQueryClient() {
  return new QueryClient(reactQueryClientConfig);
}

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}
