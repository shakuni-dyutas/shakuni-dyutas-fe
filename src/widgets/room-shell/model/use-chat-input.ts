import { type KeyboardEvent, useCallback, useState } from 'react';

interface UseChatInputParams {
  maxLength: number;
  onSubmit?: (message: string) => void;
}

interface UseChatInputResult {
  value: string;
  setValue: (next: string) => void;
  remaining: number;
  error: string | null;
  handleChange: (next: string) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: () => void;
  reset: () => void;
}

function useChatInput({ maxLength, onSubmit }: UseChatInputParams): UseChatInputResult {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  const remaining = maxLength - value.length;

  const handleChange = useCallback(
    (next: string) => {
      if (next.length > maxLength) {
        setError(`메시지는 ${maxLength}자 이하로 입력해 주세요.`);
        return;
      }

      setError(null);
      setValue(next);
    },
    [maxLength],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('메시지를 입력해 주세요.');
      return;
    }

    onSubmit?.(trimmed);
    setValue('');
    setError(null);
  }, [onSubmit, value]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (isComposing) {
        return;
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, isComposing],
  );

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const reset = () => {
    setValue('');
    setError(null);
  };

  return {
    value,
    setValue,
    remaining,
    error,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleCompositionStart,
    handleCompositionEnd,
    reset,
  };
}

export type { UseChatInputParams, UseChatInputResult };
export { useChatInput };
