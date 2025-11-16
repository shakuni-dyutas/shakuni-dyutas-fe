'use client';

import { useState } from 'react';

import { useSessionStore } from '@/entities/session/model/session-store';
import { signOut } from '@/features/auth/session/model/session-service';
import { Button } from '@/shared/ui/button';

function ProfileHeader() {
  const { user } = useSessionStore();
  const [isSigningOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-xl rounded-xl border p-6 text-center text-muted-foreground">
        로그인 상태를 확인하고 있어요.
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-2 text-center">
      <p className="text-muted-foreground text-sm">환영합니다.</p>
      <h1 className="font-semibold text-3xl">{user.nickname}</h1>
      <p className="text-muted-foreground">{user.email}</p>
      <Button className="mt-4" variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? '로그아웃 중...' : '로그아웃'}
      </Button>
    </section>
  );
}

export { ProfileHeader };
