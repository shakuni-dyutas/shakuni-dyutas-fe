import type * as React from 'react';

import { cn } from '@/shared/lib/utils';

interface ScoreDonutProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

const SIZE_CONFIG = {
  sm: {
    wrapper: 'size-16',
    strokeWidth: 4,
    fontSize: 'text-xs',
  },
  md: {
    wrapper: 'size-24',
    strokeWidth: 6,
    fontSize: 'text-sm',
  },
  lg: {
    wrapper: 'size-32',
    strokeWidth: 8,
    fontSize: 'text-base',
  },
} as const;

/**
 * CSS 기반 도넛 차트 컴포넌트
 * SVG를 사용하여 점수를 시각화합니다.
 */
function ScoreDonut({
  score,
  size = 'md',
  color = 'hsl(var(--chart-1))',
  label,
  className,
  ...props
}: ScoreDonutProps) {
  const config = SIZE_CONFIG[size];
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  // SVG circle 속성 계산
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={cn('relative inline-flex flex-col items-center gap-1', className)} {...props}>
      <div className={cn('relative', config.wrapper)}>
        <svg
          className="-rotate-90 size-full"
          viewBox="0 0 100 100"
          aria-label={`Score: ${normalizedScore}`}
        >
          <title>Score: {normalizedScore}</title>
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold tabular-nums', config.fontSize)}>{normalizedScore}</span>
        </div>
      </div>

      {label && <p className="line-clamp-1 text-center text-muted-foreground text-xs">{label}</p>}
    </div>
  );
}

export { ScoreDonut };
export type { ScoreDonutProps };
