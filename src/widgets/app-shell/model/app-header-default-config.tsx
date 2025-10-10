import type { ReactNode } from 'react';

import type { AppHeaderBackButtonProps } from '../ui/app-header-back-button';
import type { AppHeaderNotificationsButtonProps } from '../ui/app-header-notifications-button';
import type { AppHeaderSearchButtonProps } from '../ui/app-header-search-button';

type Toggleable<T> = T & { enabled?: boolean };

interface AppHeaderDefaultActionsConfig {
  back?: Toggleable<AppHeaderBackButtonProps>;
  search?: Toggleable<AppHeaderSearchButtonProps>;
  notifications?: Toggleable<AppHeaderNotificationsButtonProps>;
}

interface AppHeaderDefaultItemsConfig {
  left?: ReactNode[];
  center?: ReactNode[];
  right?: ReactNode[];
}

const DEFAULT_TITLE_NODE = <span className="font-semibold text-base tracking-tight">Dyutas</span>;

export type { AppHeaderDefaultActionsConfig, AppHeaderDefaultItemsConfig, Toggleable };
export { DEFAULT_TITLE_NODE };
