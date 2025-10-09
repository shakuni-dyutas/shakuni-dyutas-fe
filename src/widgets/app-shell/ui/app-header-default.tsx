'use client';

import { ArrowLeft, Bell, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { AppHeader } from './app-header';

const ICON_BUTTON_BASE_CLASS =
  'size-10 rounded-full border border-border/60 bg-background/90 shadow-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60';

interface AppHeaderDefaultProps {
  onBackClick?: () => void;
  isBackDisabled?: boolean;
  centerSlot?: ReactNode;
  onSearchClick?: () => void;
  isSearchDisabled?: boolean;
  isSearchLoading?: boolean;
  onNotificationsClick?: () => void;
  isNotificationsDisabled?: boolean;
  isNotificationsLoading?: boolean;
  rightAccessorySlot?: ReactNode;
  className?: string;
  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;
}

function AppHeaderDefault({
  onBackClick,
  isBackDisabled = false,
  centerSlot,
  onSearchClick,
  isSearchDisabled = false,
  isSearchLoading = false,
  onNotificationsClick,
  isNotificationsDisabled = false,
  isNotificationsLoading = false,
  rightAccessorySlot,
  className,
  leftClassName,
  centerClassName,
  rightClassName,
}: AppHeaderDefaultProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (isBackDisabled) {
      return;
    }

    if (onBackClick) {
      onBackClick();
      return;
    }

    router.back();
  };

  const handleSearchClick = () => {
    if (isSearchDisabled || isSearchLoading) {
      return;
    }
    onSearchClick?.();
  };

  const handleNotificationsClick = () => {
    if (isNotificationsDisabled || isNotificationsLoading) {
      return;
    }
    onNotificationsClick?.();
  };

  const leftSlot = (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={handleBackClick}
      disabled={isBackDisabled}
      className={cn(ICON_BUTTON_BASE_CLASS, 'justify-center bg-secondary/40 hover:bg-secondary/70')}
    >
      <span className="sr-only">뒤로가기</span>
      <ArrowLeft aria-hidden="true" className="size-5" />
    </Button>
  );

  const rightSlot = (
    <>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleSearchClick}
        disabled={isSearchDisabled || isSearchLoading}
        className={cn(
          ICON_BUTTON_BASE_CLASS,
          'justify-center bg-secondary/30 hover:bg-secondary/60',
        )}
        aria-busy={isSearchLoading}
      >
        <span className="sr-only">검색 열기</span>
        {isSearchLoading ? (
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <Search aria-hidden="true" className="size-5" />
        )}
      </Button>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleNotificationsClick}
        disabled={isNotificationsDisabled || isNotificationsLoading}
        className={cn(
          ICON_BUTTON_BASE_CLASS,
          'justify-center bg-secondary/30 hover:bg-secondary/60',
        )}
        aria-busy={isNotificationsLoading}
      >
        <span className="sr-only">알림 보기</span>
        {isNotificationsLoading ? (
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
        ) : (
          <Bell aria-hidden="true" className="size-5" />
        )}
      </Button>

      {rightAccessorySlot}
    </>
  );

  return (
    <AppHeader
      leftSlot={leftSlot}
      centerSlot={centerSlot ?? <span className="text-base font-semibold">Dyutas</span>}
      rightSlot={rightSlot}
      className={className}
      leftClassName={leftClassName}
      centerClassName={centerClassName}
      rightClassName={rightClassName}
    />
  );
}

export { AppHeaderDefault };
export type { AppHeaderDefaultProps };
