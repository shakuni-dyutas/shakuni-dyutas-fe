'use client';

import { Crown } from 'lucide-react';

import type { RankingUser } from '@/entities/ranking/types/ranking';
import { formatPoints, formatWinRate } from '@/shared/lib/format-number';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

interface RankingPodiumProps {
  users: RankingUser[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const PODIUM_ORDER = [0, 1, 2] as const; // 기본(모바일) 순서: 1, 2, 3위
const PODIUM_HEIGHT_CLASSES = ['h-36 md:h-60', 'h-36 md:h-52', 'h-36 md:h-42'] as const;
const PODIUM_ORDER_CLASSES = ['md:order-2', 'md:order-1', 'md:order-3'] as const;
const CROWN_COLORS = ['text-amber-400', 'text-slate-400', 'text-amber-700'] as const;

function RankingPodium({ users, isLoading = false, isError = false, onRetry }: RankingPodiumProps) {
  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        랭킹 데이터를 불러오는 중 오류가 발생했습니다.
        {onRetry ? (
          <Button variant="ghost" size="sm" className="ml-2" onClick={onRetry}>
            다시 시도
          </Button>
        ) : null}
      </div>
    );
  }

  const podium = PODIUM_ORDER.map((index) => users[index]).filter(Boolean) as RankingUser[];
  const showSkeleton = isLoading || podium.length === 0;

  return (
    <section
      aria-label="상위 3위 포디움"
      className="flex flex-col gap-3 md:grid md:grid-cols-3 md:items-end md:gap-4"
    >
      {showSkeleton
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`podium-skeleton-${index + 1}`}
              className={cn(
                'flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-sm md:p-4',
                'w-full',
                PODIUM_HEIGHT_CLASSES[index],
                PODIUM_ORDER_CLASSES[index],
              )}
              aria-busy="true"
            >
              <div>
                <div className="mb-3 h-6 w-20 rounded-full bg-muted/70" />
                <div className="mb-2 h-4 w-28 rounded-full bg-muted/60" />
                <div className="h-4 w-16 rounded-full bg-muted/50" />
              </div>
              <div className="h-2 w-full rounded-full bg-muted/40" />
            </div>
          ))
        : podium.map((user, index) => (
            <article
              key={user.userId}
              className={cn(
                'flex flex-col justify-between gap-2 rounded-xl border border-border bg-card p-3 shadow-sm md:gap-3 md:p-4',
                'w-full',
                PODIUM_HEIGHT_CLASSES[index],
                PODIUM_ORDER_CLASSES[index],
                user.isCurrentUser && 'ring-2 ring-primary/50',
              )}
            >
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 font-semibold text-xs"
                  >
                    <Crown size={14} aria-hidden className={CROWN_COLORS[index]} />
                    {user.rank}위
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {formatWinRate(user.winRate)} 승률
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={`${user.nickname} 아바타`} />
                    ) : null}
                    <AvatarFallback>{user.nickname.at(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{user.nickname}</p>
                    <p className="text-muted-foreground text-sm">{formatPoints(user.points)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span className="font-semibold">전적</span>
                  <span className="tabular-nums">
                    {user.wins}승 {user.loses}패
                  </span>
                </div>
              </div>
            </article>
          ))}
    </section>
  );
}

export { RankingPodium };
