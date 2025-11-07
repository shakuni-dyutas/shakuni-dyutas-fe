'use client';

import { useState } from 'react';

import { signOut } from '@/features/auth/session/model/session-service';
import { Button } from '@/shared/ui/button';

function ProfilePage() {
  const [isSigningOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="text-center">
        <h1 className="font-semibold text-2xl">내 프로필</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          로그인한 사용자 정보를 보여줄 페이지입니다.
        </p>
        <Button
          className="mt-6"
          variant="destructive"
          size="lg"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? '로그아웃 중...' : '로그아웃'}
        </Button>
      </div>
    </section>
  );
}

export { ProfilePage };
