import { Coins, FilePlus2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface RoomActionButtonsProps {
  onBetClick?: () => void;
  onEvidenceClick?: () => void;
  isEvidenceDisabled?: boolean;
  hasSubmittedEvidence?: boolean;
}

function RoomActionButtons({
  onBetClick,
  onEvidenceClick,
  isEvidenceDisabled,
  hasSubmittedEvidence,
}: RoomActionButtonsProps) {
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
        disabled={isEvidenceDisabled}
      >
        <FilePlus2 className="size-5" aria-hidden />
        <span>{hasSubmittedEvidence ? '제출 완료' : '증거 제출'}</span>
      </Button>
    </div>
  );
}

export { RoomActionButtons };
