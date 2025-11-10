import { SendHorizonal } from 'lucide-react';
import { useId } from 'react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useChatInput } from '@/widgets/room-shell/model/use-chat-input';
import { RoomActionButtons } from '@/widgets/room-shell/ui/room-action-buttons';

interface RoomFooterBarProps {
  onSubmit?: (value: string) => void;
  onBetClick?: () => void;
  onEvidenceClick?: () => void;
  isEvidenceDisabled?: boolean;
  hasSubmittedEvidence?: boolean;
  maxLength?: number;
}

function RoomFooterBar({
  onSubmit,
  onBetClick,
  onEvidenceClick,
  isEvidenceDisabled,
  hasSubmittedEvidence,
  maxLength = 500,
}: RoomFooterBarProps) {
  const inputId = useId();
  const descriptionId = `${inputId}-description`;
  const {
    value,
    error,
    remaining,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleCompositionStart,
    handleCompositionEnd,
  } = useChatInput({
    maxLength,
    onSubmit,
  });
  const isSubmitDisabled = !value.trim() || Boolean(error);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-border border-t bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <RoomActionButtons
          onBetClick={onBetClick}
          onEvidenceClick={onEvidenceClick}
          isEvidenceDisabled={isEvidenceDisabled}
          hasSubmittedEvidence={hasSubmittedEvidence}
        />
        <form
          className="flex w-full gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <label className="sr-only" htmlFor={inputId}>
            채팅 입력
          </label>
          <Input
            id={inputId}
            name="room-chat-input"
            className="flex-1 rounded-full border-2 border-border bg-muted/30 px-6 py-6 text-base"
            placeholder="채팅을 입력하세요."
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            aria-describedby={descriptionId}
            aria-invalid={Boolean(error)}
          />
          <Button
            type="submit"
            className="h-14 w-14 rounded-full"
            aria-label="채팅 전송"
            disabled={isSubmitDisabled}
          >
            <SendHorizonal className="size-5" aria-hidden />
          </Button>
        </form>
        <div className="flex items-center justify-between px-1 text-xs" id={descriptionId}>
          <p className={error ? 'text-destructive' : 'text-muted-foreground'}>
            {error ?? `남은 글자 수 ${remaining}자`}
          </p>
        </div>
      </div>
    </div>
  );
}

export { RoomFooterBar };
