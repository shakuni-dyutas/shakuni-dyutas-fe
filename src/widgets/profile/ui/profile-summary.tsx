'use client';

import { useSessionStore } from '@/entities/session/model/session-store';
import { ProfileSummarySkeleton } from '@/widgets/profile/ui/profile-summary.skeleton';

const SUMMARY_ITEMS = [
  {
    id: 'debates',
    label: '참여',
    field: 'debates',
  },
  {
    id: 'wins',
    label: '승리',
    field: 'wins',
  },
  {
    id: 'loses',
    label: '패배',
    field: 'loses',
  },
] as const;

function ProfileSummary() {
  const { user } = useSessionStore();

  if (!user) {
    return <ProfileSummarySkeleton />;
  }

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="grid grid-cols-3 gap-3">
        {SUMMARY_ITEMS.map((item) => (
          <article key={item.id} className="rounded-2xl border bg-card p-4 text-center shadow-sm">
            <p className="text-muted-foreground text-sm">{item.label}</p>
            <p className="mt-2 font-semibold text-2xl">{user[item.field]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export { ProfileSummary };
