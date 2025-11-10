import { Card, CardContent } from '@/shared/ui/card';

const SUMMARY_PLACEHOLDER_KEYS = ['summary-a', 'summary-b', 'summary-c'] as const;
const CARD_PLACEHOLDER_KEYS = ['card-a', 'card-b', 'card-c'] as const;
const PARTICIPANT_PLACEHOLDER_KEYS = [
  'participant-a',
  'participant-b',
  'participant-c',
  'participant-d',
] as const;

function RoomShellSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20 pb-32">
      <div className="border-border border-b bg-background/80 py-6 shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4">
          <div className="h-6 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-3 sm:grid-cols-3">
            {SUMMARY_PLACEHOLDER_KEYS.map((key) => (
              <div key={key} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {CARD_PLACEHOLDER_KEYS.map((key) => (
              <Card key={`skeleton-card-${key}`} className="border-dashed">
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hidden h-fit border-dashed lg:block">
            <CardContent>
              <div className="space-y-3">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                {PARTICIPANT_PLACEHOLDER_KEYS.map((key) => (
                  <div
                    key={`participant-${key}`}
                    className="h-4 w-full animate-pulse rounded bg-muted"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-border border-t bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
        <div className="mx-auto flex w-full max-w-5xl gap-3">
          <div className="h-12 flex-1 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-28 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export { RoomShellSkeleton };
