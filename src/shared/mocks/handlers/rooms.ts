import { delay, HttpResponse, http } from 'msw';
import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant } from '@/entities/participant/types/participant';
import {
  getRoomFactionColor,
  ROOM_CHAT_CONSTRAINTS,
  ROOM_EVIDENCE_CONSTRAINTS,
} from '@/entities/room/config/constants';
import type { Room } from '@/entities/room/types/room';
import type { RoomDetail, RoomFactionSnapshot } from '@/entities/room/types/room-detail';
import type { TeamBettingSnapshot, TeamFaction } from '@/entities/team/types/team-faction';

const ROOM_CREATE_ENDPOINT = '*/rooms';
const ROOM_CREATION_DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 1000;
const ROOM_DETAIL_DELAY_MS = process.env.NODE_ENV === 'test' ? 0 : 400;

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

const ROOM_DETAIL_FACTIONS: TeamFaction[] = [
  {
    id: 'faction-alpha',
    name: '알파 진영',
    description: 'AI 의사결정은 인간의 편견을 줄일 수 있다',
    color: getRoomFactionColor(0),
  },
  {
    id: 'faction-beta',
    name: '베타 진영',
    description: 'AI 의사결정은 감정적 맥락을 잃는다',
    color: getRoomFactionColor(1),
  },
];

const ROOM_DETAIL_PARTICIPANTS: Participant[] = [
  {
    id: 'user-1',
    nickname: '호스트아키',
    avatarUrl: '/mock/avatar-host.png',
    factionId: 'faction-alpha',
    status: 'online',
    role: 'host',
    joinedAt: '2025-11-08T02:30:00.000Z',
    totalBetPoints: 1_500,
  },
  {
    id: 'user-2',
    nickname: '데이터여왕',
    avatarUrl: '/mock/avatar-02.png',
    factionId: 'faction-alpha',
    status: 'online',
    role: 'member',
    joinedAt: '2025-11-08T02:33:00.000Z',
    totalBetPoints: 900,
  },
  {
    id: 'user-3',
    nickname: '감성파상어',
    avatarUrl: '/mock/avatar-03.png',
    factionId: 'faction-beta',
    status: 'online',
    role: 'member',
    joinedAt: '2025-11-08T02:35:00.000Z',
    totalBetPoints: 700,
  },
  {
    id: 'user-4',
    nickname: '밈장군',
    avatarUrl: '/mock/avatar-04.png',
    factionId: 'faction-beta',
    status: 'offline',
    role: 'member',
    joinedAt: '2025-11-08T02:41:00.000Z',
    totalBetPoints: 400,
  },
  {
    id: 'user-5',
    nickname: '팩트폭격기',
    avatarUrl: '/mock/avatar-05.png',
    factionId: 'faction-alpha',
    status: 'online',
    role: 'member',
    joinedAt: '2025-11-08T02:47:00.000Z',
    totalBetPoints: 500,
  },
];

const ROOM_DETAIL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-1',
      nickname: '호스트아키',
      avatarUrl: '/mock/avatar-host.png',
    },
    body: '오늘 라운드는 감정 노동 자동화가 주제입니다. 자료 준비해 주세요!',
    createdAt: '2025-11-08T02:32:00.000Z',
  },
  {
    id: 'chat-2',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-3',
      nickname: '감성파상어',
      avatarUrl: '/mock/avatar-03.png',
    },
    body: 'AI는 공감이 없어서 CS 만족도가 떨어진 사례가 있습니다.',
    createdAt: '2025-11-08T02:36:00.000Z',
  },
  {
    id: 'chat-3',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-2',
      nickname: '데이터여왕',
      avatarUrl: '/mock/avatar-02.png',
    },
    body: '반대로 AI 덕분에 상담 대기 시간이 40% 줄어들었습니다.',
    createdAt: '2025-11-08T02:38:00.000Z',
  },
];

const ROOM_DETAIL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'evi-1',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-2',
      nickname: '데이터여왕',
      avatarUrl: '/mock/avatar-02.png',
    },
    summary: '콜센터 자동화 성공 사례',
    body: 'AI 보조 상담 도입 후 평균 처리 시간이 35% 단축.',
    submittedAt: '2025-11-08T02:50:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-1',
        type: 'image',
        url: '/mock/evidence/alpha-graph.png',
        thumbnailUrl: '/mock/evidence/alpha-graph-thumb.png',
        sizeInBytes: 450_000,
        description: '효율성 비교 그래프',
      },
    ],
  },
  {
    id: 'evi-2',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-3',
      nickname: '감성파상어',
      avatarUrl: '/mock/avatar-03.png',
    },
    summary: 'AI 공감 실패 사례',
    body: '감정 케어 실패로 고객 불만이 폭증한 보고서를 첨부합니다.',
    submittedAt: '2025-11-08T02:54:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-2',
        type: 'image',
        url: '/mock/evidence/beta-sentiment.png',
        thumbnailUrl: '/mock/evidence/beta-sentiment-thumb.png',
        sizeInBytes: 530_000,
        description: 'CS 만족도 하락 그래프',
      },
    ],
  },
];

function buildTeamBettingSnapshots(
  participants: Participant[],
  factions: TeamFaction[],
): TeamBettingSnapshot[] {
  return factions.map((faction) => {
    const relatedParticipants = participants.filter(
      (participant) => participant.factionId === faction.id,
    );
    const totalBetPoints = relatedParticipants.reduce(
      (sum, participant) => sum + participant.totalBetPoints,
      0,
    );

    return {
      factionId: faction.id,
      participantCount: relatedParticipants.length,
      totalBetPoints,
      averageBetPoints:
        relatedParticipants.length > 0
          ? Math.round(totalBetPoints / relatedParticipants.length)
          : 0,
    };
  });
}

function buildFactionSnapshots(
  teamStats: TeamBettingSnapshot[],
  evidenceItems: EvidenceItem[],
): RoomFactionSnapshot[] {
  return ROOM_DETAIL_FACTIONS.map((faction) => {
    const stats = teamStats.find((item) => item.factionId === faction.id);
    const evidenceCount = evidenceItems.filter((item) => item.factionId === faction.id).length;

    return {
      ...faction,
      memberCount: stats?.participantCount ?? 0,
      totalBetPoints: stats?.totalBetPoints ?? 0,
      evidenceCount,
    };
  });
}

interface BuildRoomDetailMockOptions {
  minBetPoints?: number;
  timeLimitMinutes?: number;
}

const ROOM_DETAIL_DEFAULTS = {
  minBetPoints: 100,
  timeLimitMinutes: 60,
} as const;

function buildRoomDetailMock(roomId: string, options: BuildRoomDetailMockOptions = {}): RoomDetail {
  const minBetPoints = options.minBetPoints ?? ROOM_DETAIL_DEFAULTS.minBetPoints;
  const timeLimitMinutes = options.timeLimitMinutes ?? ROOM_DETAIL_DEFAULTS.timeLimitMinutes;
  const teamStats = buildTeamBettingSnapshots(ROOM_DETAIL_PARTICIPANTS, ROOM_DETAIL_FACTIONS);
  const totalPoolPoints = teamStats.reduce((sum, stat) => sum + stat.totalBetPoints, 0);
  const factionsSnapshots = buildFactionSnapshots(teamStats, ROOM_DETAIL_EVIDENCE_ITEMS);
  const evidenceGroups = ROOM_DETAIL_FACTIONS.map((faction) => ({
    factionId: faction.id,
    factionName: faction.name,
    submissions: ROOM_DETAIL_EVIDENCE_ITEMS.filter((item) => item.factionId === faction.id),
  }));
  const host =
    ROOM_DETAIL_PARTICIPANTS.find((participant) => participant.role === 'host') ??
    ROOM_DETAIL_PARTICIPANTS[0];
  const createdAt = '2025-11-08T02:30:00.000Z';
  const endsAt = new Date(
    new Date(createdAt).getTime() + timeLimitMinutes * 60 * 1000,
  ).toISOString();

  return {
    id: roomId,
    title: '방 안에서 벌어지는 노동의 미래',
    topic: 'AI 감정 노동 규제 가능성',
    description:
      'AI 상담원이 대체할 수 없는 감정 노동의 한계와 보완책을 두 진영으로 나누어 토론합니다.',
    createdAt,
    timeLimitMinutes,
    host,
    countdown: {
      endsAt,
      remainingSeconds: Math.max(timeLimitMinutes * 60 - 5 * 60, 0),
    },
    restrictions: {
      minBetPoints,
      evidence: {
        textMaxLength: ROOM_EVIDENCE_CONSTRAINTS.TEXT_MAX_LENGTH,
        imageMaxSizeMb: ROOM_EVIDENCE_CONSTRAINTS.IMAGE_MAX_SIZE_MB,
        imageMaxCount: ROOM_EVIDENCE_CONSTRAINTS.IMAGE_MAX_COUNT,
      },
      chat: {
        maxLength: ROOM_CHAT_CONSTRAINTS.MAX_LENGTH,
      },
    },
    factions: factionsSnapshots,
    betting: {
      totalPoolPoints,
      minBetPoints,
      factions: teamStats,
    },
    participants: ROOM_DETAIL_PARTICIPANTS,
    evidenceGroups,
    chatMessages: ROOM_DETAIL_CHAT_MESSAGES,
  };
}

const roomDetailStore = new Map<string, RoomDetail>();

function getStoredRoomDetail(roomId: string) {
  let detail = roomDetailStore.get(roomId);
  if (!detail) {
    detail = buildRoomDetailMock(roomId);
    roomDetailStore.set(roomId, detail);
  }
  return detail;
}

function cloneRoomDetail(detail: RoomDetail): RoomDetail {
  return JSON.parse(JSON.stringify(detail)) as RoomDetail;
}

function applyFilters(rooms: Room[], params: URLSearchParams): Room[] {
  // status 쿼리는 view로 동작: active | hot | new | ended
  const view = (params.get('view') ?? params.get('status')) as
    | 'active'
    | 'hot'
    | 'new'
    | 'ended'
    | null;
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

  http.get('*/rooms', ({ request }) => {
    const url = new URL(request.url);
    const filtered = applyFilters(MOCK_ROOMS, url.searchParams);
    return HttpResponse.json({ rooms: filtered });
  }),

  http.get('*/rooms/:roomId', async ({ params }) => {
    const { roomId } = params as { roomId: string };

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json({ room: cloneRoomDetail(getStoredRoomDetail(roomId)) });
  }),

  http.post('*/rooms/:roomId/bets', async ({ params, request }) => {
    const { roomId } = params as { roomId: string };
    const body = (await request.json()) as { factionId?: string; points?: number };

    if (!body.factionId || typeof body.points !== 'number') {
      return HttpResponse.json({ message: '진영과 포인트를 모두 입력해 주세요.' }, { status: 400 });
    }

    const roomDetail = getStoredRoomDetail(roomId);

    if (!roomDetail) {
      return HttpResponse.json({ message: '존재하지 않는 방입니다.' }, { status: 404 });
    }

    if (body.points < roomDetail.betting.minBetPoints) {
      return HttpResponse.json({ message: '최소 배팅 포인트보다 적습니다.' }, { status: 400 });
    }

    const bettingSnapshot = roomDetail.betting.factions.find(
      (snapshot) => snapshot.factionId === body.factionId,
    );

    const factionSnapshot = roomDetail.factions.find((faction) => faction.id === body.factionId);

    if (!bettingSnapshot || !factionSnapshot) {
      return HttpResponse.json({ message: '존재하지 않는 진영입니다.' }, { status: 404 });
    }

    bettingSnapshot.totalBetPoints += body.points;
    roomDetail.betting.totalPoolPoints += body.points;
    factionSnapshot.totalBetPoints += body.points;

    return HttpResponse.json({
      betting: cloneRoomDetail(roomDetail).betting,
      factions: cloneRoomDetail(roomDetail).factions,
      message: '배팅이 완료되었어요.',
    });
  }),
];
