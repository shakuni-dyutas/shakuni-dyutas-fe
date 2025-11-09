import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        success:
          'border-transparent bg-emerald-600 text-white shadow-xs hover:bg-emerald-600/90 dark:bg-emerald-500',
        warning:
          'border-transparent bg-amber-500 text-black shadow-xs hover:bg-amber-500/90 dark:text-white',
        info: 'border-transparent bg-sky-600 text-white shadow-xs hover:bg-sky-600/90 dark:bg-sky-500',
        outline: 'text-foreground border bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
