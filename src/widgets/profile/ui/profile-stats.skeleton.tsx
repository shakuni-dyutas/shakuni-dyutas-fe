'use client';

function ProfileStatsSkeleton() {
  return (
    <section className="mx-auto grid w-full max-w-2xl gap-4 md:grid-cols-2">
      {[0, 1].map((item) => (
        <article
          key={`profile-stats-skeleton-${item}`}
          className="rounded-2xl border bg-card p-4 shadow-sm"
        >
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-8 w-32 animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-3 w-40 animate-pulse rounded-full bg-muted" />
        </article>
      ))}
    </section>
  );
}

export { ProfileStatsSkeleton };
