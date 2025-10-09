import ky from 'ky';

import { API_CONFIG } from '@/shared/config/constants';

const httpClient = ky.create({
  prefixUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  retry: {
    limit: API_CONFIG.RETRY_COUNT,
  },
  credentials: 'include',
});

export { httpClient };
