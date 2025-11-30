import type * as React from 'react';

import { cn } from '@/shared/lib/utils';

interface ComparisonBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  valueA: number;
  valueB: number;
  labelA?: string;
  labelB?: string;
  colorA?: string;
  colorB?: string;
}

/**
 * 두 값을 비교하는 바 차트 컴포넌트
 * 양쪽에서 중앙으로 진행되는 형태
 */
function ComparisonBar({
  label,
  valueA,
  valueB,
  labelA = 'A',
  labelB = 'B',
  colorA = 'hsl(var(--chart-1))',
  colorB = 'hsl(var(--chart-2))',
  className,
  ...props
}: ComparisonBarProps) {
  const total = valueA + valueB;
  const percentA = total > 0 ? (valueA / total) * 100 : 50;
  const percentB = total > 0 ? (valueB / total) * 100 : 50;

  return (
    <div className={cn('space-y-1', className)} {...props}>
      {/* Label and scores */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex gap-4 text-xs tabular-nums">
          <span style={{ color: colorA }}>
            {labelA}: {valueA}
          </span>
          <span style={{ color: colorB }}>
            {labelB}: {valueB}
          </span>
        </div>
      </div>

      {/* Progress bars */}
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
        <div
          className="rounded-l-full transition-all duration-500"
          style={{
            width: `${percentA}%`,
            backgroundColor: colorA,
          }}
        />
        <div
          className="rounded-r-full transition-all duration-500"
          style={{
            width: `${percentB}%`,
            backgroundColor: colorB,
          }}
        />
      </div>
    </div>
  );
}

export { ComparisonBar };
export type { ComparisonBarProps };
