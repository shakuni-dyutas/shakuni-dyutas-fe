'use client';

import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect } from 'react';

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
  const isBootstrapping = useSessionStore((state) => state.isBootstrapping);

  useEffect(() => {
    if (isAuthenticated || isBootstrapping) {
      return;
    }

    const targetPath = resolveRedirectPath(pathname);
    const redirectUrl = buildRedirectUrl(targetPath);

    router.replace(redirectUrl);
  }, [isAuthenticated, isBootstrapping, pathname, router]);

  if (!isAuthenticated) {
    if (isBootstrapping) {
      return (
        <div className="flex h-dvh items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <span className="sr-only">세션을 확인하고 있어요.</span>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}

export { AuthGuard };
