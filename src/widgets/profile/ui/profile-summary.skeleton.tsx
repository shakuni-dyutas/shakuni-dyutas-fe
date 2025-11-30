'use client';

function ProfileSummarySkeleton() {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((item) => (
          <article
            key={`profile-summary-skeleton-${item}`}
            className="rounded-2xl border bg-card p-4 text-center shadow-sm"
          >
            <div className="mx-auto h-4 w-16 animate-pulse rounded-full bg-muted" />
            <div className="mx-auto mt-3 h-6 w-12 animate-pulse rounded-full bg-muted" />
          </article>
        ))}
      </div>
    </section>
  );
}

export { ProfileSummarySkeleton };
