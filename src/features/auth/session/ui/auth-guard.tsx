'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef } from 'react';

import { useSessionStore } from '@/entities/session/model/session-store';
import { ROUTE_PATHS } from '@/shared/config/constants';

function resolveRedirectPath(pathname: string | null) {
  if (typeof pathname !== 'string') {
    return ROUTE_PATHS.HOME;
  }

  if (!pathname.startsWith('/') || pathname.startsWith('//')) {
    return ROUTE_PATHS.HOME;
  }

  return pathname;
}

function buildRedirectUrl(destination: string) {
  const params = new URLSearchParams({ redirect: destination });
  return `${ROUTE_PATHS.LOGIN}?${params.toString()}`;
}

function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated || hasRedirectedRef.current) {
      return;
    }

    const targetPath = resolveRedirectPath(pathname);
    const redirectUrl = buildRedirectUrl(targetPath);

    hasRedirectedRef.current = true;
    router.replace(redirectUrl);
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export { AuthGuard };
