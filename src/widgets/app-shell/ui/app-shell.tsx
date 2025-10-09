import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

const APP_SHELL_SAFE_AREA_STYLE: CSSProperties = {
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
};

interface AppShellProps {
  children: ReactNode;
  headerSlot?: ReactNode;
  bottomNavigationSlot?: ReactNode;
  className?: string;
  mainClassName?: string;
  contentClassName?: string;
}

function AppShell({
  children,
  headerSlot,
  bottomNavigationSlot,
  className,
  mainClassName,
  contentClassName,
}: AppShellProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-dvh flex-col bg-background text-foreground',
        'md:items-center md:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.05),_transparent_65%)]',
        className,
      )}
      style={APP_SHELL_SAFE_AREA_STYLE}
      data-slot="app-shell"
    >
      {headerSlot ? (
        <header className="sticky top-0 z-20 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-3 md:px-6 md:py-4">
            {headerSlot}
          </div>
        </header>
      ) : null}

      <main
        className={cn(
          'flex w-full flex-1 px-4 pb-28 pt-4 md:px-6 md:pb-20 md:pt-6',
          'lg:px-8 lg:pb-24 lg:pt-8',
          mainClassName,
        )}
        data-slot="app-shell:main"
      >
        <div className={cn('mx-auto flex w-full max-w-3xl flex-col gap-6', contentClassName)}>
          {children}
        </div>
      </main>

      {bottomNavigationSlot ? (
        <nav
          aria-label="주요 내비게이션"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 shadow-[0_-12px_32px_-18px_rgba(15,23,42,0.35)] backdrop-blur supports-[backdrop-filter]:bg-background/75 md:px-6"
          data-slot="app-shell:bottom-nav"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2">
            {bottomNavigationSlot}
          </div>
        </nav>
      ) : null}
    </div>
  );
}

export { AppShell };
