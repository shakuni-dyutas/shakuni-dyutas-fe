import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface GoogleLoginButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

function GoogleLoginButton({
  onClick,
  isLoading = false,
  disabled = false,
}: GoogleLoginButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-3 py-6 text-base"
      aria-label="Google 계정으로 계속하기"
      aria-busy={isLoading}
      onClick={onClick}
      disabled={isDisabled}
    >
      <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.8 10.2h-9.8v3.6h5.6c-.2 1.4-.9 2.5-1.9 3.2-.8.6-1.8.9-3.2.9-2.4 0-4.5-1.6-5.2-3.9-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9c.7-2.3 2.8-3.9 5.2-3.9 1.4 0 2.6.5 3.4 1.1l2.5-2.5C16.6 3.6 14.6 3 12.6 3 8.4 3 4.8 5.7 3.6 9.5c-.3 1-.5 2-.5 3s.2 2 .5 3c1.2 3.8 4.7 6.5 9 6.5 2.7 0 4.9-.9 6.5-2.4 1.8-1.7 2.8-4.2 2.8-7.1 0-.7-.1-1.4-.1-1.8z"
          fill="currentColor"
        />
      </svg>
      <span className="font-semibold" aria-live="polite">
        {isLoading ? 'Google 로그인 중…' : 'Google 계정으로 계속하기'}
      </span>
      {isLoading ? (
        <Loader2 aria-hidden="true" className="size-5 animate-spin text-muted-foreground" />
      ) : (
        <ArrowRight aria-hidden="true" className="size-5 text-muted-foreground" />
      )}
    </Button>
  );
}

export { GoogleLoginButton };
