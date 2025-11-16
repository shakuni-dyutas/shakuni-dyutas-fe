'use client';

import { ProfileHeader } from '@/widgets/profile-header/ui/profile-header';
import { ProfileHistory } from '@/widgets/profile-history/ui/profile-history';

function ProfilePage() {
  return (
    <section className="flex flex-1 flex-col gap-8 px-4 py-8">
      <ProfileHeader />
      <ProfileHistory />
    </section>
  );
}

export { ProfilePage };
