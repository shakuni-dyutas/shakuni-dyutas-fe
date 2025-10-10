'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';

interface NavigationItem {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  showLabel?: boolean;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}

interface BottomNavigationProps {
  items: NavigationItem[];
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

function BottomNavigation({
  items,
  className,
  itemClassName,
  activeItemClassName,
}: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn('flex w-full items-center justify-between px-4 py-2', className)}
      data-slot="app-shell:bottom-nav-container"
    >
      {items.map((item) => {
        const Icon = item.isLoading ? undefined : item.icon;
        const isActive = item.href ? pathname === item.href : false;
        const isDisabled = Boolean(item.disabled || item.isLoading);
        const ariaLabel = item.ariaLabel ?? item.label;
        const showLabel = item.showLabel ?? true;

        const buttonClasses = cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'flex-1 gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors',
          'h-auto min-h-9 text-muted-foreground data-[active=true]:text-primary',
          item.className,
          itemClassName,
          isActive && activeItemClassName,
        );

        const iconElement = Icon ? (
          <Icon className={cn('size-5', item.iconClassName)} aria-hidden="true" />
        ) : null;
        const labelElement = showLabel ? (
          <span className={item.labelClassName}>{item.label}</span>
        ) : (
          <span className="sr-only">{item.label}</span>
        );

        if (item.onClick) {
          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              className={buttonClasses}
              aria-label={ariaLabel}
              onClick={item.onClick}
              disabled={isDisabled}
              data-active={isActive}
              aria-busy={item.isLoading ? 'true' : undefined}
            >
              {iconElement}
              {labelElement}
            </Button>
          );
        }

        if (item.href) {
          return (
            <Button
              key={item.id}
              asChild
              variant="ghost"
              size="sm"
              className={buttonClasses}
              aria-label={ariaLabel}
              data-active={isActive}
              data-disabled={isDisabled ? 'true' : undefined}
              aria-busy={item.isLoading ? 'true' : undefined}
            >
              <Link href={item.href}>
                {iconElement}
                {labelElement}
              </Link>
            </Button>
          );
        }

        return (
          <div
            key={item.id}
            className={cn(
              'flex flex-1 items-center justify-center rounded-full border border-transparent px-3 py-2 text-xs font-medium text-muted-foreground',
              item.className,
              itemClassName,
            )}
            aria-busy={item.isLoading ? 'true' : undefined}
            data-active={isActive}
          >
            {iconElement}
            {labelElement}
          </div>
        );
      })}
    </div>
  );
}

export { BottomNavigation };
export type { BottomNavigationProps, NavigationItem };
