'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';

import { cn } from '@/shared/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isPrimary?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
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
      className={cn('flex w-full items-center justify-between px-4 py-2 ', className)}
      data-slot="app-shell:bottom-nav-container"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        const buttonClasses = cn(
          'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors',
          'text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          item.isPrimary &&
            'max-w-fit -mt-6 flex-1 basis-auto px-4 py-3 text-sm shadow-[0_10px_30px_-15px_rgba(59,130,246,0.9)]',
          isActive && 'text-primary',
          itemClassName,
          isActive && activeItemClassName,
        );

        if (item.onClick) {
          return (
            <button
              key={item.id}
              type="button"
              className={buttonClasses}
              aria-label={item.ariaLabel ?? item.label}
              onClick={item.onClick}
              data-active={isActive}
            >
              <Icon className={cn('size-5', item.isPrimary && 'size-6')} aria-hidden="true" />
              {!item.isPrimary ? <span>{item.label}</span> : null}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={buttonClasses}
            aria-label={item.ariaLabel ?? item.label}
            data-active={isActive}
          >
            <Icon className={cn('size-5', item.isPrimary && 'size-6')} aria-hidden="true" />
            {!item.isPrimary ? <span>{item.label}</span> : null}
          </Link>
        );
      })}
    </div>
  );
}

export { BottomNavigation };
export type { BottomNavigationProps, NavigationItem };
