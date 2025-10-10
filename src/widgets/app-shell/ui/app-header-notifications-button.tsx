'use client';

import { Bell, Loader2 } from 'lucide-react';
import type { MouseEvent } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { ICON_BUTTON_BASE_CLASS } from '../lib/action-styles';

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
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (disabled || loading) {
      return;
    }

    onClick?.();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(ICON_BUTTON_BASE_CLASS, 'bg-secondary/30 hover:bg-secondary/60', className)}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="size-5 animate-spin" />
      ) : (
        <Bell aria-hidden="true" className="size-5" />
      )}
      {showLabel ? (
        <span className="ml-2 text-sm font-medium">알림</span>
      ) : (
        <span className="sr-only">알림 보기</span>
      )}
    </Button>
  );
}

export { AppHeaderNotificationsButton };
export type { AppHeaderNotificationsButtonProps };
