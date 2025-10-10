import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-border bg-card text-card-foreground rounded-2xl border shadow-sm transition-colors',
        'supports-[backdrop-filter]:backdrop-blur-md',
        className,
      )}
      data-slot="card"
      {...props}
    />
  ),
);

Card.displayName = 'Card';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6', className)} {...props} />,
);

CardContent.displayName = 'CardContent';

export { Card, CardContent };
