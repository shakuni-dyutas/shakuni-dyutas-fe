'use client';

import type { ReactNode } from 'react';
import { buildDefaultHeaderItems } from '../model/app-header-default-builders';
import type {
  AppHeaderDefaultActionsConfig,
  AppHeaderDefaultItemsConfig,
} from '../model/app-header-default-config';
import { AppHeader } from './app-header';

interface AppHeaderDefaultProps {
  title?: ReactNode;
  actions?: AppHeaderDefaultActionsConfig;
  items?: AppHeaderDefaultItemsConfig;
  className?: string;
  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;
}

function AppHeaderDefault({
  title,
  actions,
  items,
  className,
  leftClassName,
  centerClassName,
  rightClassName,
}: AppHeaderDefaultProps) {
  const { leftItems, centerItems, rightItems } = buildDefaultHeaderItems({
    title,
    actions,
    items,
  });

  return (
    <AppHeader
      leftItems={leftItems}
      centerItems={centerItems}
      rightItems={rightItems}
      className={className}
      leftClassName={leftClassName}
      centerClassName={centerClassName}
      rightClassName={rightClassName}
    />
  );
}

export { AppHeaderDefault };
export type { AppHeaderDefaultProps };
