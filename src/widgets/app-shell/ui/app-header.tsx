'use client';

import { Children, Fragment, isValidElement, type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { DEFAULT_TITLE_NODE } from '@/widgets/app-shell/model/app-header-default-config';

interface AppHeaderProps {
  leftItems?: ReactNode[];
  centerItems?: ReactNode[];
  rightItems?: ReactNode[];
  className?: string;
  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;
}

function renderNodes(nodes: ReactNode[] | undefined, _slot: string) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  return Children.map(nodes, (node) => {
    if (isValidElement(node) && node.key != null) {
      return node;
    }

    return <Fragment>{node}</Fragment>;
  });
}

function AppHeader({
  leftItems = [],
  centerItems = [],
  rightItems = [],
  className,
  leftClassName,
  centerClassName,
  rightClassName,
}: AppHeaderProps) {
  const leftContent = renderNodes(leftItems, 'left');
  const centerContent = renderNodes(
    centerItems.length > 0 ? centerItems : [DEFAULT_TITLE_NODE],
    'center',
  );
  const rightContent = renderNodes(rightItems, 'right');

  return (
    <header
      className={cn('flex w-full items-center justify-between gap-4', 'md:px-2 md:py-1', className)}
      data-slot="app-shell:header"
    >
      <div
        className={cn('flex min-h-10 min-w-10 items-center gap-2', leftClassName)}
        data-slot="app-shell:header-left"
      >
        {leftContent}
      </div>

      <div
        className={cn('flex flex-1 items-center justify-center gap-3', centerClassName)}
        data-slot="app-shell:header-center"
      >
        {centerContent}
      </div>

      <div
        className={cn('flex min-h-10 min-w-10 items-center justify-end gap-3', rightClassName)}
        data-slot="app-shell:header-right"
      >
        {rightContent}
      </div>
    </header>
  );
}

export { AppHeader };
export type { AppHeaderProps };
