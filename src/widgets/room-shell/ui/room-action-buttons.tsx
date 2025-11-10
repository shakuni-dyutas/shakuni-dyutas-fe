import { Coins, FilePlus2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';

function RoomActionButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button className="h-14 flex-1 rounded-full font-semibold text-base" size="lg">
        <Coins className="size-5" aria-hidden />
        <span>배팅</span>
      </Button>
      <Button
        className="h-14 flex-1 rounded-full font-semibold text-base"
        size="lg"
        variant="outline"
      >
        <FilePlus2 className="size-5" aria-hidden />
        <span>증거 제출</span>
      </Button>
    </div>
  );
}

export { RoomActionButtons };
