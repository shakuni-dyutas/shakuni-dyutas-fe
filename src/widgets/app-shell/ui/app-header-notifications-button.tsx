'use client';

import { Bell, Loader2 } from 'lucide-react';

import { AppHeaderActionButton } from './app-header-action-button';

interface AppHeaderNotificationsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  showLabel?: boolean;
  className?: string;
}

function AppHeaderNotificationsButton({
  onClick,
  disabled = false,
  loading = false,
  ariaLabel = '알림 보기',
  showLabel = false,
  className,
}: AppHeaderNotificationsButtonProps) {
  return (
    <AppHeaderActionButton
      icon={Bell}
      loadingIcon={Loader2}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      ariaLabel={ariaLabel}
      label="알림"
      showLabel={showLabel}
      className={className}
    />
  );
}

export { AppHeaderNotificationsButton };
export type { AppHeaderNotificationsButtonProps };
