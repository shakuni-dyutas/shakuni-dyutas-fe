'use client';
import { useMemo, useState } from 'react';

import type { RoomFilters } from '@/entities/room/types/room';
import { CreateRoomCTA } from '@/widgets/lobby/ui/create-room-cta';
import { LobbyTabs } from '@/widgets/lobby/ui/lobby-tabs';
import { RoomList } from '@/widgets/lobby/ui/room-list';

function LobbyPage() {
  const [tab, setTab] = useState<NonNullable<RoomFilters['view']>>('active');
  const filters: RoomFilters = { view: tab, sort: tab === 'hot' ? 'betting' : 'latest' };
  const mockRooms = [
    {
      id: '1',
      title: 'Is AI replacing human creativity?',
      description: 'Debate about artificial intelligence impact on creative industries',
      team_a: 'AI Enhances Creativity',
      team_b: 'AI Kills Creativity',
      participants: 24,
      max_participants: 100,
      time_left: '2h 15m',
      total_betting: 15420,
      team_a_ratio: 65,
      team_b_ratio: 35,
      status: 'active' as const,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Should remote work be permanent?',
      description: 'Post-pandemic work culture and productivity discussions',
      team_a: 'Remote Forever',
      team_b: 'Return to Office',
      participants: 18,
      max_participants: 100,
      time_left: '45m',
      total_betting: 8900,
      team_a_ratio: 42,
      team_b_ratio: 58,
      status: 'active' as const,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Electric cars vs Traditional cars',
      description: 'Environmental impact and practicality comparison',
      team_a: 'Electric Future',
      team_b: 'Hybrid Solution',
      participants: 31,
      max_participants: 100,
      time_left: '3h 22m',
      total_betting: 22100,
      team_a_ratio: 71,
      team_b_ratio: 29,
      status: 'active' as const,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: '4',
      title: 'Nuclear energy as a climate solution',
      description: 'Safety, waste, and scalability considerations',
      team_a: 'Pro Nuclear',
      team_b: 'Anti Nuclear',
      participants: 11,
      max_participants: 100,
      time_left: '—',
      total_betting: 5400,
      team_a_ratio: 50,
      team_b_ratio: 50,
      status: 'ended' as const,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  const filteredRooms = useMemo(() => {
    if (tab === 'active') {
      return mockRooms.filter((room) => room.status === 'active');
    }
    if (tab === 'ended') {
      return mockRooms.filter((room) => room.status === 'ended');
    }
    if (tab === 'hot') {
      return mockRooms
        .filter((room) => room.status === 'active')
        .sort((a, b) => b.total_betting + b.participants - (a.total_betting + a.participants))
        .slice(0, 10);
    }
    // tab === 'new'
    return mockRooms
      .filter((room) => room.status === 'active')
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 10);
  }, [tab, mockRooms]);

  return (
    <>
      <section className="px-4 py-4">
        <LobbyTabs value={tab} onValueChange={setTab} />
        <div className="mt-4">
          <RoomList filters={filters} rooms={filteredRooms} />
        </div>
      </section>
      <CreateRoomCTA />
    </>
  );
}

export { LobbyPage };
