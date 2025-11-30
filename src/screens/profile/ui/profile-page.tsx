'use client';

import { ProfileHeader } from '@/widgets/profile/ui/profile-header';
import { ProfileHistory } from '@/widgets/profile/ui/profile-history';
import { ProfileStats } from '@/widgets/profile/ui/profile-stats';
import { ProfileSummary } from '@/widgets/profile/ui/profile-summary';

function ProfilePage() {
  return (
    <section className="flex flex-1 flex-col gap-8 px-4 py-8">
      <ProfileHeader />
      <ProfileStats />
      <ProfileSummary />
      <ProfileHistory />
    </section>
  );
}

export { ProfilePage };
