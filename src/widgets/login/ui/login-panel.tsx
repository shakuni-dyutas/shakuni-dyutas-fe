'use client';

import Image from 'next/image';

import { IS_GOOGLE_CLIENT_CONFIGURED } from '@/features/auth/google/config/google-oauth-config';
import { useGoogleOAuth } from '@/features/auth/google/model/use-google-oauth';
import { GoogleLoginButton } from '@/features/auth/google/ui/google-login-button';

function LoginPanel() {
  const { signIn, isLoading, errorMessage } = useGoogleOAuth();

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
          onClick={signIn}
          isLoading={isLoading}
          disabled={!IS_GOOGLE_CLIENT_CONFIGURED}
        />

        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export { LoginPanel };
