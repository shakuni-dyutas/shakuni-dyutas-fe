'use client';

import type { RankingUser } from '@/entities/ranking/types/ranking';
import { formatPoints, formatWinRate } from '@/shared/lib/format-number';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface RankingItemProps {
  user: RankingUser;
}

function RankingItem({ user }: RankingItemProps) {
  return (
    <li
      className={cn(
        'flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition',
        user.isCurrentUser && 'ring-2 ring-primary/40',
      )}
      data-current-user={user.isCurrentUser ? 'true' : 'false'}
    >
      <div className="flex items-center gap-3">
        <span className="w-8 text-center font-semibold">#{user.rank}</span>
        <Avatar className="h-10 w-10">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={`${user.nickname} 아바타`} />
          ) : null}
          <AvatarFallback>{user.nickname.at(0) ?? 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <p className="font-semibold leading-tight">{user.nickname}</p>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>
              {user.wins}승 {user.loses}패
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 text-sm">
        <p className="font-semibold">{formatPoints(user.points)}</p>
        <p className="text-muted-foreground">{formatWinRate(user.winRate)} 승률</p>
      </div>
    </li>
  );
}

export { RankingItem };
