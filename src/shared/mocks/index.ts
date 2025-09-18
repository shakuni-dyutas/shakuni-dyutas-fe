'use client';

export async function enableMocking() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const { worker } = await import('./browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
