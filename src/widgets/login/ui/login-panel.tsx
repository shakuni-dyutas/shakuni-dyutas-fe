'use client';

import Image from 'next/image';

import {
  GOOGLE_OAUTH_ERROR_MESSAGES,
  IS_GOOGLE_CLIENT_CONFIGURED,
} from '@/features/auth/google/config/google-oauth-config';
import { useCompleteGoogleLogin } from '@/features/auth/google/model/use-complete-google-login';
import { useGoogleOAuth } from '@/features/auth/google/model/use-google-oauth';
import { GoogleLoginButton } from '@/features/auth/google/ui/google-login-button';

interface LoginPanelProps {
  redirectUri?: string;
}

interface LoginPanelContentProps {
  onClick: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  isDisabled: boolean;
}

const noop = () => {};

function LoginPanelContent({
  onClick,
  isLoading,
  errorMessage,
  isDisabled,
}: LoginPanelContentProps) {
  return (
    <section className="border-border bg-background/95 flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border px-8 py-12 text-center shadow-lg">
      <Image
        src="/logo.png"
        alt="Shakuni Dyutas 로고"
        width={96}
        height={96}
        priority
        className="border-border/40 bg-background rounded-full border object-cover"
      />

      <p className="text-muted-foreground text-sm">AI 기반 논쟁 게임 플랫폼 Dyutas</p>

      <div className="w-full space-y-3">
        <GoogleLoginButton onClick={onClick} isLoading={isLoading} disabled={isDisabled} />

        {errorMessage ? (
          <p className="text-destructive text-sm" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function LoginPanel({ redirectUri }: LoginPanelProps) {
  if (!IS_GOOGLE_CLIENT_CONFIGURED) {
    return (
      <LoginPanelContent
        onClick={noop}
        isLoading={false}
        isDisabled
        errorMessage={GOOGLE_OAUTH_ERROR_MESSAGES.CLIENT_ID_MISSING}
      />
    );
  }

  return <ConfiguredLoginPanel redirectUri={redirectUri} />;
}

function ConfiguredLoginPanel({ redirectUri }: LoginPanelProps) {
  const {
    completeLogin,
    isLoading: isCompletingLogin,
    errorMessage: completeLoginError,
    resetError: resetCompleteLoginError,
  } = useCompleteGoogleLogin();
  const {
    signIn,
    isLoading: isRequestingCode,
    errorMessage: authorizationError,
    resetError: resetAuthorizationError,
  } = useGoogleOAuth({
    onSuccess: (codeResponse) => {
      resetCompleteLoginError();
      completeLogin({ code: codeResponse.code, redirectUri });
    },
  });

  const handleSignIn = () => {
    resetAuthorizationError();
    resetCompleteLoginError();
    signIn();
  };

  const isLoading = isRequestingCode || isCompletingLogin;
  const resolvedErrorMessage = authorizationError ?? completeLoginError;

  return (
    <LoginPanelContent
      onClick={handleSignIn}
      isLoading={isLoading}
      errorMessage={resolvedErrorMessage}
      isDisabled={false}
    />
  );
}

export { LoginPanel };
