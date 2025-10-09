'use client';

import { runtimeEnv } from '@/shared/config/env';
import { logDebug } from '@/shared/lib/logger';

let workerInitialization: Promise<void> | null = null;

export async function enableMocking() {
  if (!runtimeEnv.isApiMockingEnabled) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  if (workerInitialization) {
    await workerInitialization;
    return;
  }

  workerInitialization = (async () => {
    const { worker } = await import('./browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  })();

  try {
    await workerInitialization;
  } catch (error) {
    workerInitialization = null;
    logDebug('MSW', '워커 초기화 중 오류가 발생했어요.', error);
    throw error;
  }
}
