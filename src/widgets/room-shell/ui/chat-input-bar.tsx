import { SendHorizonal } from 'lucide-react';
import { type FormEvent, useId } from 'react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface ChatInputBarProps {
  onSubmit?: (value: string) => void;
}

function ChatInputBar({ onSubmit }: ChatInputBarProps) {
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = (formData.get('room-chat-input') as string)?.trim() ?? '';

    if (!value) {
      return;
    }

    onSubmit?.(value);
    event.currentTarget.reset();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-border border-t bg-background/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <form className="mx-auto flex w-full max-w-6xl gap-3" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={inputId}>
          채팅 입력
        </label>
        <Input
          id={inputId}
          name="room-chat-input"
          className="flex-1 rounded-full border-2 border-border bg-muted/30 px-6 py-6 text-base"
          placeholder="채팅을 입력하세요."
        />
        <Button type="submit" className="h-14 w-14 rounded-full" aria-label="채팅 전송">
          <SendHorizonal className="size-5" aria-hidden />
        </Button>
      </form>
    </div>
  );
}

export { ChatInputBar };
