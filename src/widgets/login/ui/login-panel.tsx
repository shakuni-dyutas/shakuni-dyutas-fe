'use client';

import Image from 'next/image';

import { IS_GOOGLE_CLIENT_CONFIGURED } from '@/features/auth/google/config/google-oauth-config';
import { useCompleteGoogleLogin } from '@/features/auth/google/model/use-complete-google-login';
import { useGoogleOAuth } from '@/features/auth/google/model/use-google-oauth';
import { GoogleLoginButton } from '@/features/auth/google/ui/google-login-button';

interface LoginPanelProps {
  redirectUri?: string;
}

function LoginPanel({ redirectUri }: LoginPanelProps) {
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
    <section className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-border bg-background/95 px-8 py-12 text-center shadow-lg">
      <Image
        src="/logo.png"
        alt="Shakuni Dyutas 로고"
        width={96}
        height={96}
        priority
        className="rounded-full border border-border/40 bg-background object-cover"
      />

      <p className="text-sm text-muted-foreground">AI 기반 논쟁 게임 플랫폼 Dyutas</p>

      <div className="w-full space-y-3">
        <GoogleLoginButton
          onClick={handleSignIn}
          isLoading={isLoading}
          disabled={!IS_GOOGLE_CLIENT_CONFIGURED}
        />

        {resolvedErrorMessage ? (
          <p className="text-sm text-destructive" role="alert" aria-live="polite">
            {resolvedErrorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export { LoginPanel };
