'use client';

import type { PropsWithChildren } from 'react';

import { AuthGuard } from '@/features/auth/session/ui/auth-guard';

function ProtectedLayout({ children }: PropsWithChildren) {
  return <AuthGuard>{children}</AuthGuard>;
}

export default ProtectedLayout;
