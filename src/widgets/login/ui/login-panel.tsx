import Image from 'next/image';

import { GoogleLoginButton } from '@/features/auth/google/ui/google-login-button';

function LoginPanel() {
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

      <GoogleLoginButton />
    </section>
  );
}

export { LoginPanel };
