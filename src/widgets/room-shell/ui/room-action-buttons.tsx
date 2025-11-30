import { Coins, FilePlus2, SquareArrowOutUpRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface RoomActionButtonsProps {
  onBetClick?: () => void;
  onEvidenceClick?: () => void;
  isEvidenceDisabled?: boolean;
  hasSubmittedEvidence?: boolean;
  isBetDisabled?: boolean;
  isEnded?: boolean;
  onResultClick?: () => void;
}

function RoomActionButtons({
  onBetClick,
  onEvidenceClick,
  isEvidenceDisabled,
  hasSubmittedEvidence,
  isBetDisabled,
  isEnded,
  onResultClick,
}: RoomActionButtonsProps) {
  if (isEnded) {
    return (
      <div className="flex flex-row gap-3">
        <Button
          className="h-14 w-full rounded-full font-semibold text-base"
          size="lg"
          onClick={onResultClick}
          variant="destructive"
        >
          <SquareArrowOutUpRight className="size-5" aria-hidden />
          <span>결과 확인</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-3">
      <Button
        className="h-14 flex-1 rounded-full font-semibold text-base"
        size="lg"
        onClick={onBetClick}
        disabled={isBetDisabled}
      >
        <Coins className="size-5" aria-hidden />
        <span>{isBetDisabled ? '배팅 완료' : '배팅'}</span>
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
