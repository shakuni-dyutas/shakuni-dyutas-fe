'use client';

import type { ComponentType, MouseEvent } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { ICON_BUTTON_BASE_CLASS } from '../lib/action-styles';

interface AppHeaderActionButtonProps {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  loadingIcon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

function AppHeaderActionButton({
  icon: Icon,
  loadingIcon: LoadingIcon,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  label,
  showLabel = false,
  className,
}: AppHeaderActionButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (disabled || loading) {
      return;
    }

    onClick?.();
  };

  const RenderIcon = loading ? (LoadingIcon ?? Icon) : Icon;

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
      <RenderIcon aria-hidden className="size-5" />
      {showLabel ? (
        <span className="ml-2 font-medium text-sm">{label ?? ariaLabel}</span>
      ) : (
        <span className="sr-only">{ariaLabel}</span>
      )}
    </Button>
  );
}

export { AppHeaderActionButton };
export type { AppHeaderActionButtonProps };
