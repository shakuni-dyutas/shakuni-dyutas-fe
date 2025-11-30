'use client';

import { Crown, MoveRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useSessionStore } from '@/entities/session/model/session-store';
import { ROUTE_PATHS } from '@/shared/config/constants';
import { formatPoints, formatRank } from '@/shared/lib/format-number';
import { Button } from '@/shared/ui/button';
import { ProfileStatsSkeleton } from '@/widgets/profile/ui/profile-stats.skeleton';

function ProfileStats() {
  const { user } = useSessionStore();

  if (!user) {
    return <ProfileStatsSkeleton />;
  }

  return (
    <section className="mx-auto grid w-full max-w-2xl gap-4 md:grid-cols-2">
      <article className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Trophy className="text-primary" size={20} aria-hidden="true" />
          <h3 className="text-muted-foreground text-sm">보유 포인트</h3>
        </div>
        <p className="mt-2 font-semibold text-3xl">{formatPoints(user.points)}</p>
        <p className="mt-1 text-muted-foreground text-xs">
          배팅/활동을 통해 획득한 누적 포인트입니다.
        </p>
      </article>
      <article className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Crown className="text-primary" size={20} aria-hidden="true" />
          <h3 className="text-muted-foreground text-sm">랭크</h3>
        </div>
        <p className="mt-2 font-semibold text-3xl">{formatRank(user.rank)}</p>
        <p className="mt-1 text-muted-foreground text-xs">플랫폼 전체 순위 기준입니다.</p>
        <div className="mt-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            aria-label="랭킹 페이지로 이동하여 전체 순위를 확인"
          >
            <Link href={ROUTE_PATHS.RANKINGS}>
              모든 랭킹 보기
              <MoveRight size={14} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </article>
    </section>
  );
}

export { ProfileStats };
