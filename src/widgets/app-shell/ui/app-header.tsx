'use client';

import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

const DEFAULT_HEADER_TITLE = 'Shakuni Dyutas';

interface AppHeaderProps {
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;
}

function AppHeader({
  leftSlot,
  centerSlot,
  rightSlot,
  className,
  leftClassName,
  centerClassName,
  rightClassName,
}: AppHeaderProps) {
  const resolvedCenterSlot = centerSlot ?? (
    <span className="text-base font-semibold tracking-tight">{DEFAULT_HEADER_TITLE}</span>
  );

  return (
    <div
      className={cn('flex w-full items-center justify-between gap-4', 'md:px-2 md:py-1', className)}
      data-slot="app-shell:header"
    >
      <div
        className={cn('flex min-h-10 min-w-10 items-center gap-2', leftClassName)}
        data-slot="app-shell:header-left"
      >
        {leftSlot}
      </div>

      <div
        className={cn('flex flex-1 items-center justify-center', centerClassName)}
        data-slot="app-shell:header-center"
      >
        {resolvedCenterSlot}
      </div>

      <div
        className={cn('flex min-h-10 min-w-10 items-center justify-end gap-3', rightClassName)}
        data-slot="app-shell:header-right"
      >
        {rightSlot}
      </div>
    </div>
  );
}

export { AppHeader };
export type { AppHeaderProps };
