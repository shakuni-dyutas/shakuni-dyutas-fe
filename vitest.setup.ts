import '@testing-library/jest-dom/vitest';

import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { resetAuthMockState } from '@/shared/mocks/handlers/auth';
import { server } from '@/shared/mocks/server';

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NEXT_PUBLIC_API_MOCKING = 'disabled';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  resetAuthMockState();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
