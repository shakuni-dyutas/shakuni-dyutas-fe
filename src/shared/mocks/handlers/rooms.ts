import { delay, HttpResponse, http } from 'msw';

import type { Room } from '@/entities/room/types/room';

const ROOM_CREATE_ENDPOINT = '/api/rooms';
const ROOM_CREATION_DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 1000;

const MOCK_ROOMS: Room[] = [
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
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
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
    status: 'active',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
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
    status: 'active',
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
    status: 'ended',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function applyFilters(rooms: Room[], params: URLSearchParams): Room[] {
  // status 쿼리는 view로 동작: active | hot | new | ended
  const view = params.get('status') as 'active' | 'hot' | 'new' | 'ended' | null;
  const search = params.get('search') ?? '';
  const sort = params.get('sort') as 'latest' | 'betting' | 'participants' | null;

  let result = rooms.slice();

  if (view === 'active') {
    result = result.filter((room) => room.status === 'active');
  } else if (view === 'ended') {
    result = result.filter((room) => room.status === 'ended');
  } else if (view === 'hot') {
    result = result
      .filter((room) => room.status === 'active')
      .sort((a, b) => b.total_betting + b.participants - (a.total_betting + a.participants))
      .slice(0, 20);
  } else if (view === 'new') {
    result = result
      .filter((room) => room.status === 'active')
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 20);
  }

  if (search) {
    const normalizedSearchQuery = search.toLowerCase();
    result = result.filter(
      (room) =>
        room.title.toLowerCase().includes(normalizedSearchQuery) ||
        room.description.toLowerCase().includes(normalizedSearchQuery) ||
        room.team_a.toLowerCase().includes(normalizedSearchQuery) ||
        room.team_b.toLowerCase().includes(normalizedSearchQuery),
    );
  }

  if (sort === 'latest') {
    result.sort((a, b) => b.created_at.localeCompare(a.created_at));
  } else if (sort === 'betting') {
    result.sort((a, b) => b.total_betting - a.total_betting);
  } else if (sort === 'participants') {
    result.sort((a, b) => b.participants - a.participants);
  }

  return result;
}

export const roomsHandlers = [
  http.post(ROOM_CREATE_ENDPOINT, async ({ request }) => {
    const body = (await request.json()) as {
      title?: string;
    };

    if (!body.title) {
      return HttpResponse.json(
        { message: '방 제목이 필요해요.' },
        {
          status: 400,
        },
      );
    }

    await delay(ROOM_CREATION_DELAY_MS);

    return HttpResponse.json(
      {
        roomId: 'room-1234',
        redirectPath: '/rooms/room-1234',
      },
      { status: 201 },
    );
  }),

  http.get('/api/rooms', ({ request }) => {
    const url = new URL(request.url);
    const filtered = applyFilters(MOCK_ROOMS, url.searchParams);
    return HttpResponse.json({ rooms: filtered });
  }),
];
