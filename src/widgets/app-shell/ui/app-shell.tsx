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
      className={cn('bg-background text-foreground relative flex min-h-dvh flex-col', className)}
      style={APP_SHELL_SAFE_AREA_STYLE}
      data-slot="app-shell"
    >
      {headerSlot ? (
        <header className="bg-background/80 sticky top-0 z-20 w-full">
          <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-3 md:px-6 md:py-4">
            {headerSlot}
          </div>
        </header>
      ) : null}

      <main
        className={cn(
          'flex w-full flex-1 px-4 pt-4 pb-28 md:px-6 md:pt-6 md:pb-20',
          'lg:px-8 lg:pt-8 lg:pb-24',
          mainClassName,
        )}
        data-slot="app-shell:main"
      >
        <div className={cn('mx-auto flex w-full max-w-5xl flex-col gap-6', contentClassName)}>
          {children}
        </div>
      </main>

      {bottomNavigationSlot ? (
        <nav
          aria-label="주요 내비게이션"
          className="fixed inset-x-0 bottom-0 z-30"
          data-slot="app-shell:bottom-nav"
        >
          <div className="border-border bg-background/95 mx-auto w-full max-w-5xl border-t px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] md:px-6">
            <div className="mx-auto flex w-full items-center justify-between gap-2">
              {bottomNavigationSlot}
            </div>
          </div>
        </nav>
      ) : null}
    </div>
  );
}

export { AppShell };
