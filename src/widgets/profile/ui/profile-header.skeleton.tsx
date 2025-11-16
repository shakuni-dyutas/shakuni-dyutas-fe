'use client';

function ProfileHeaderSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 text-center">
      <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
      <div className="space-y-2">
        <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-40 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
    </section>
  );
}

export { ProfileHeaderSkeleton };
