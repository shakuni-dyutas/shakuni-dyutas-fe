'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { ICON_BUTTON_BASE_CLASS } from '../lib/action-styles';

interface AppHeaderBackButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  showLabel?: boolean;
  className?: string;
}

function AppHeaderBackButton({
  onClick,
  disabled = false,
  ariaLabel = '뒤로가기',
  showLabel = false,
  className,
}: AppHeaderBackButtonProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }

    if (onClick) {
      onClick();
      return;
    }

    router.back();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(ICON_BUTTON_BASE_CLASS, 'bg-secondary/40 hover:bg-secondary/70', className)}
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
      {showLabel ? (
        <span className="ml-2 text-sm font-medium">뒤로가기</span>
      ) : (
        <span className="sr-only">뒤로가기</span>
      )}
    </Button>
  );
}

export { AppHeaderBackButton };
export type { AppHeaderBackButtonProps };
