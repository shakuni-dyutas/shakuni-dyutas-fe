'use client';

import { useState } from 'react';

import { useSessionStore } from '@/entities/session/model/session-store';
import { signOut } from '@/features/auth/session/model/session-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { ProfileHeaderSkeleton } from '@/widgets/profile/ui/profile-header.skeleton';

function ProfileHeader() {
  const { user } = useSessionStore();
  const [isSigningOut, setSigningOut] = useState(false);

  if (!user) {
    return <ProfileHeaderSkeleton />;
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 text-center">
      <Avatar className="h-20 w-20 text-lg">
        {user.profileImageUrl ? (
          <AvatarImage
            src={user.profileImageUrl}
            alt={`${user.nickname} 아바타`}
            className="object-cover"
          />
        ) : (
          <AvatarFallback>{user.nickname.charAt(0).toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <div>
        <h1 className="font-semibold text-3xl">{user.nickname}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      <Button className="mt-2" variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? '로그아웃 중...' : '로그아웃'}
      </Button>
    </section>
  );
}

export { ProfileHeader };
