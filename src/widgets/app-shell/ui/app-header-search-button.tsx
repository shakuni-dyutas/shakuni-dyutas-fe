'use client';

import { Loader2, Search } from 'lucide-react';
import type { MouseEvent } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { ICON_BUTTON_BASE_CLASS } from '../lib/action-styles';

interface AppHeaderSearchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  showLabel?: boolean;
  className?: string;
}

function AppHeaderSearchButton({
  onClick,
  disabled = false,
  loading = false,
  ariaLabel = '검색 열기',
  showLabel = false,
  className,
}: AppHeaderSearchButtonProps) {
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
        <Search aria-hidden="true" className="size-5" />
      )}
      {showLabel ? (
        <span className="ml-2 text-sm font-medium">검색</span>
      ) : (
        <span className="sr-only">검색 열기</span>
      )}
    </Button>
  );
}

export { AppHeaderSearchButton };
export type { AppHeaderSearchButtonProps };
