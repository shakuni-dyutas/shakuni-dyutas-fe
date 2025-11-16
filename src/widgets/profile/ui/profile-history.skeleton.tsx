function ProfileHistorySkeleton() {
  return (
    <ul className="space-y-3">
      {[0, 1, 2].map((item) => (
        <li key={`profile-history-skeleton-${item}`} className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export { ProfileHistorySkeleton };
