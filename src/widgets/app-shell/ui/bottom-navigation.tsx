'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
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
      className={cn('flex w-full items-center justify-between px-4 py-2', className)}
      data-slot="app-shell:bottom-nav-container"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        const buttonClasses = cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'flex-1 gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors',
          'h-auto min-h-9 text-muted-foreground data-[active=true]:text-primary',
          itemClassName,
          isActive && activeItemClassName,
        );

        if (item.onClick) {
          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              size="sm"
              className={buttonClasses}
              aria-label={item.ariaLabel ?? item.label}
              onClick={item.onClick}
              data-active={isActive}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Button>
          );
        }

        return (
          <Button
            key={item.id}
            asChild
            variant="ghost"
            size="sm"
            className={buttonClasses}
            aria-label={item.ariaLabel ?? item.label}
            data-active={isActive}
          >
            <Link href={item.href}>
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

export { BottomNavigation };
export type { BottomNavigationProps, NavigationItem };
