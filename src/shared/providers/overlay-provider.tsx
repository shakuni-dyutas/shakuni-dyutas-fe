'use client';

import { OverlayProvider as OverlayKitProvider } from 'overlay-kit';
import type { PropsWithChildren } from 'react';

interface OverlayRootProviderProps extends PropsWithChildren {}

function OverlayRootProvider({ children }: OverlayRootProviderProps) {
  return <OverlayKitProvider>{children}</OverlayKitProvider>;
}

export { OverlayRootProvider };
