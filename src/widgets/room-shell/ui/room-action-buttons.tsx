import { Coins, FilePlus2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface RoomActionButtonsProps {
  onBetClick?: () => void;
  onEvidenceClick?: () => void;
}

function RoomActionButtons({ onBetClick, onEvidenceClick }: RoomActionButtonsProps) {
  return (
    <div className="flex flex-row gap-3">
      <Button
        className="h-14 flex-1 rounded-full font-semibold text-base"
        size="lg"
        onClick={onBetClick}
      >
        <Coins className="size-5" aria-hidden />
        <span>배팅</span>
      </Button>
      <Button
        className="h-14 flex-1 rounded-full font-semibold text-base"
        size="lg"
        variant="outline"
        onClick={onEvidenceClick}
      >
        <FilePlus2 className="size-5" aria-hidden />
        <span>증거 제출</span>
      </Button>
    </div>
  );
}

export { RoomActionButtons };
