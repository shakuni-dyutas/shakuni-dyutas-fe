'use client';

import type { RankingUser } from '@/entities/ranking/types/ranking';
import { formatPoints, formatWinRate } from '@/shared/lib/format-number';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface RankingCurrentUserCardProps {
  user: RankingUser;
}

function RankingCurrentUserCard({ user }: RankingCurrentUserCardProps) {
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
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
            <p className="text-muted-foreground text-xs">내 랭킹</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <p className="font-semibold">{formatPoints(user.points)}</p>
          <p className="text-muted-foreground">{formatWinRate(user.winRate)} 승률</p>
        </div>
      </div>
      <p className="mt-2 text-muted-foreground text-xs">
        전적 {user.wins}승 {user.loses}패
      </p>
    </div>
  );
}

export { RankingCurrentUserCard };
