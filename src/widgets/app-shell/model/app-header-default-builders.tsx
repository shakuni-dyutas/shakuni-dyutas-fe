import type { ReactNode } from 'react';
import type { AppHeaderBackButtonProps } from '../ui/app-header-back-button';
import { AppHeaderBackButton } from '../ui/app-header-back-button';
import type { AppHeaderNotificationsButtonProps } from '../ui/app-header-notifications-button';
import { AppHeaderNotificationsButton } from '../ui/app-header-notifications-button';
import type { AppHeaderSearchButtonProps } from '../ui/app-header-search-button';
import { AppHeaderSearchButton } from '../ui/app-header-search-button';
import type {
  AppHeaderDefaultActionsConfig,
  AppHeaderDefaultItemsConfig,
  Toggleable,
} from './app-header-default-config';
import { DEFAULT_TITLE_NODE } from './app-header-default-config';

function resolveToggle<T extends object>(
  option?: Toggleable<T>,
): { enabled: boolean; props: Partial<T> } {
  if (!option) {
    return { enabled: true, props: {} as Partial<T> };
  }

  const { enabled = true, ...rest } = option;

  return {
    enabled,
    props: rest as Partial<T>,
  };
}

function buildLeftItems(
  config: Toggleable<AppHeaderBackButtonProps> | undefined,
  extras: ReactNode[] | undefined,
) {
  const { enabled, props } = resolveToggle<AppHeaderBackButtonProps>(config);
  const leftItems: ReactNode[] = [];

  if (enabled) {
    leftItems.push(<AppHeaderBackButton key="back" {...props} />);
  }

  if (extras && extras.length > 0) {
    leftItems.push(...extras);
  }

  return leftItems;
}

function buildCenterItems(title: ReactNode | undefined, centerOverrides: ReactNode[] | undefined) {
  if (centerOverrides && centerOverrides.length > 0) {
    return centerOverrides;
  }

  return [title ?? DEFAULT_TITLE_NODE];
}

function buildRightItems(config: AppHeaderDefaultActionsConfig, extras: ReactNode[] | undefined) {
  const rightItems: ReactNode[] = [];

  const { enabled: searchEnabled, props: searchProps } = resolveToggle<AppHeaderSearchButtonProps>(
    config.search,
  );
  if (searchEnabled) {
    rightItems.push(<AppHeaderSearchButton key="search" {...searchProps} />);
  }

  const { enabled: notificationsEnabled, props: notificationsProps } =
    resolveToggle<AppHeaderNotificationsButtonProps>(config.notifications);
  if (notificationsEnabled) {
    rightItems.push(<AppHeaderNotificationsButton key="notifications" {...notificationsProps} />);
  }

  if (extras && extras.length > 0) {
    rightItems.push(...extras);
  }

  return rightItems;
}

function buildDefaultHeaderItems(options: {
  title?: ReactNode;
  actions?: AppHeaderDefaultActionsConfig;
  items?: AppHeaderDefaultItemsConfig;
}) {
  const actionConfig = options.actions ?? {};
  const itemsConfig = options.items ?? {};

  const leftItems = buildLeftItems(actionConfig.back, itemsConfig.left);
  const centerItems = buildCenterItems(options.title, itemsConfig.center);
  const rightItems = buildRightItems(actionConfig, itemsConfig.right);

  return { leftItems, centerItems, rightItems };
}

export {
  buildLeftItems,
  buildCenterItems,
  buildDefaultHeaderItems,
  resolveToggle,
  buildRightItems,
};
