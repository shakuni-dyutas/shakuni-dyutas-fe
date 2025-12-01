import { delay, HttpResponse, http } from 'msw';
import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant, ParticipantProfile } from '@/entities/participant/types/participant';
import { ROOM_CHAT_CONSTRAINTS, ROOM_EVIDENCE_CONSTRAINTS } from '@/entities/room/config/constants';
import type { Room } from '@/entities/room/types/room';
import type {
  RoomBettingState,
  RoomChatState,
  RoomDetail,
  RoomEvidenceState,
  RoomFactionSnapshot,
  RoomMeta,
  RoomParticipants,
} from '@/entities/room/types/room-detail';
import { TEAM_FACTION_NONE_ID } from '@/entities/team/config/constants';
import type {
  TeamBettingSnapshot,
  TeamFaction,
  TeamFactionId,
} from '@/entities/team/types/team-faction';
import { MOCK_USER } from './constants';

const textEncoder = new TextEncoder();
const roomEventStreams = new Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>();

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
    name: '규제 필요 진영',
    description: 'AI 오남용을 예방하기 위해 법적 규제가 필수라고 주장합니다.',
  },
  {
    id: 'faction-beta',
    name: '규제 불필요 진영',
    description: '혁신 속도를 위해 자율 규제만으로 충분하다고 주장합니다.',
  },
];

const ROOM_DETAIL_PARTICIPANTS: Participant[] = [
  {
    id: 'user-1',
    nickname: '정책설계자',
    avatarUrl: 'https://placehold.co/96x96/1d4ed8/ffffff?text=P1',
    factionId: 'faction-alpha',
    role: 'host',
    joinedAt: '2025-11-08T02:30:00.000Z',
    totalBetPoints: 2_200,
  },
  {
    id: 'user-2',
    nickname: '법학도',
    avatarUrl: 'https://placehold.co/96x96/2563eb/ffffff?text=L',
    factionId: 'faction-alpha',
    role: 'member',
    joinedAt: '2025-11-08T02:32:00.000Z',
    totalBetPoints: 1_100,
  },
  {
    id: 'user-5',
    nickname: '데이터감독관',
    avatarUrl: 'https://placehold.co/96x96/f97316/ffffff?text=D',
    factionId: 'faction-alpha',
    role: 'member',
    joinedAt: '2025-11-08T02:34:00.000Z',
    totalBetPoints: 800,
  },
  {
    id: 'user-6',
    nickname: '시민감시자',
    avatarUrl: 'https://placehold.co/96x96/0ea5e9/ffffff?text=C',
    factionId: 'faction-alpha',
    role: 'member',
    joinedAt: '2025-11-08T02:36:00.000Z',
    totalBetPoints: 600,
  },
  {
    id: 'user-3',
    nickname: '혁신개발자',
    avatarUrl: 'https://placehold.co/96x96/ea580c/ffffff?text=I',
    factionId: 'faction-beta',
    role: 'member',
    joinedAt: '2025-11-08T02:38:00.000Z',
    totalBetPoints: 1_300,
  },
  {
    id: 'user-4',
    nickname: '시장자유론자',
    avatarUrl: 'https://placehold.co/96x96/22c55e/ffffff?text=F',
    factionId: 'faction-beta',
    role: 'member',
    joinedAt: '2025-11-08T02:40:00.000Z',
    totalBetPoints: 950,
  },
  {
    id: 'user-7',
    nickname: '스타트업대표',
    avatarUrl: 'https://placehold.co/96x96/f59e0b/ffffff?text=S',
    factionId: 'faction-beta',
    role: 'member',
    joinedAt: '2025-11-08T02:42:00.000Z',
    totalBetPoints: 720,
  },
  {
    id: 'user-8',
    nickname: 'AI리서처',
    avatarUrl: 'https://placehold.co/96x96/14b8a6/ffffff?text=R',
    factionId: 'faction-beta',
    role: 'member',
    joinedAt: '2025-11-08T02:44:00.000Z',
    totalBetPoints: 680,
  },
  {
    id: 'user-9',
    nickname: '신규참가자',
    avatarUrl: 'https://placehold.co/96x96/10b981/ffffff?text=N',
    factionId: 'faction-alpha',
    role: 'member',
    joinedAt: '2025-11-08T02:50:00.000Z',
    totalBetPoints: 0,
  },
];

const ROOM_DETAIL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-1',
      nickname: '정책설계자',
      avatarUrl: 'https://placehold.co/96x96/1d4ed8/ffffff?text=P1',
    },
    body: '오늘 토론 주제는 “AI에 대한 강력한 법적 규제 필요성”입니다. 팩트 중심으로 이야기해 주세요.',
    createdAt: '2025-11-08T02:30:00.000Z',
  },
  {
    id: 'chat-2',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-2',
      nickname: '법학도',
      avatarUrl: 'https://placehold.co/96x96/2563eb/ffffff?text=L',
    },
    body: '최근 판례만 봐도 규제 공백 때문에 피해자가 제대로 구제되지 못했습니다.',
    createdAt: '2025-11-08T02:32:00.000Z',
  },
  {
    id: 'chat-3',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-3',
      nickname: '혁신개발자',
      avatarUrl: 'https://placehold.co/96x96/ea580c/ffffff?text=I',
    },
    body: '규제 강화는 곧 투자 철회를 의미합니다. 샌드박스가 어떻게 성장 견인했는지 수치를 가져왔어요.',
    createdAt: '2025-11-08T02:34:00.000Z',
  },
  {
    id: 'chat-4',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-7',
      nickname: '스타트업대표',
      avatarUrl: 'https://placehold.co/96x96/f59e0b/ffffff?text=S',
    },
    body: '규제가 느려지면 해외로 본사를 옮길 수밖에 없습니다. 고용도 같이 빠져요.',
    createdAt: '2025-11-08T02:35:30.000Z',
  },
  {
    id: 'chat-5',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-6',
      nickname: '시민감시자',
      avatarUrl: 'https://placehold.co/96x96/0ea5e9/ffffff?text=C',
    },
    body: '피해 제보 지도만 봐도 자율 규제는 작동하지 않는다는 게 분명합니다.',
    createdAt: '2025-11-08T02:37:00.000Z',
  },
  {
    id: 'chat-6',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-8',
      nickname: 'AI리서처',
      avatarUrl: 'https://placehold.co/96x96/14b8a6/ffffff?text=R',
    },
    body: '우리는 이미 투명성 보고서를 자율적으로 공개하고 있어요. 법제화보다 빠르게 움직이고 있습니다.',
    createdAt: '2025-11-08T02:38:30.000Z',
  },
  {
    id: 'chat-7',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-5',
      nickname: '데이터감독관',
      avatarUrl: 'https://placehold.co/96x96/f97316/ffffff?text=D',
    },
    body: '벌금 부과 후 재발률이 60% 줄어든 데이터를 조금 후에 공유하겠습니다.',
    createdAt: '2025-11-08T02:40:00.000Z',
  },
  {
    id: 'chat-8',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-4',
      nickname: '시장자유론자',
      avatarUrl: 'https://placehold.co/96x96/22c55e/ffffff?text=F',
    },
    body: '규제안이 통과되면 기업당 연 120억 원의 추가 비용이 든다는 리포트를 첨부했습니다.',
    createdAt: '2025-11-08T02:41:30.000Z',
  },
  {
    id: 'chat-9',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-1',
      nickname: '정책설계자',
      avatarUrl: 'https://placehold.co/96x96/1d4ed8/ffffff?text=P1',
    },
    body: '규제 필요 진영은 피해자 보호 로드맵을 3단계로 제안합니다. 곧 요약을 올릴게요.',
    createdAt: '2025-11-08T02:43:00.000Z',
  },
  {
    id: 'chat-10',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-3',
      nickname: '혁신개발자',
      avatarUrl: 'https://placehold.co/96x96/ea580c/ffffff?text=I',
    },
    body: '투자 유치와 채용 증가 데이터를 업로드했습니다. 확인 부탁드려요.',
    createdAt: '2025-11-08T02:44:30.000Z',
  },
  {
    id: 'chat-11',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-2',
      nickname: '법학도',
      avatarUrl: 'https://placehold.co/96x96/2563eb/ffffff?text=L',
    },
    body: '규제 늦추자는 주장이 victims first 원칙과 충돌함을 다시 강조합니다.',
    createdAt: '2025-11-08T02:46:00.000Z',
  },
  {
    id: 'chat-12',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-7',
      nickname: '스타트업대표',
      avatarUrl: 'https://placehold.co/96x96/f59e0b/ffffff?text=S',
    },
    body: '고객사들이 원하는 건 명확한 가이드라인이지 처벌 위주의 접근은 아닙니다.',
    createdAt: '2025-11-08T02:47:30.000Z',
  },
];

const ROOM_DETAIL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'evi-1',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-1',
      nickname: '정책설계자',
      avatarUrl: 'https://placehold.co/96x96/1d4ed8/ffffff?text=P1',
    },
    summary: '국제 규제 도입 타임라인',
    body: 'EU·캐나다에서 추진 중인 AI 규제 로드맵을 비교했습니다.',
    submittedAt: '2025-11-08T02:48:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-1',
        type: 'image',
        url: 'https://placehold.co/600x360/dbeafe/1d4ed8.png?text=Timeline',
        thumbnailUrl: 'https://placehold.co/300x200/e5e7eb/1d4ed8.png?text=Schedule',
        sizeInBytes: 410_000,
        description: '규제 로드맵 비교표',
      },
      {
        id: 'img-1-b',
        type: 'image',
        url: 'https://placehold.co/600x360/bde0fe/1d4ed8.png?text=Summary',
        thumbnailUrl: 'https://placehold.co/300x200/c7d2fe/1d4ed8.png?text=Summary',
        sizeInBytes: 382_000,
        description: '지역별 규제 일정',
      },
    ],
  },
  {
    id: 'evi-2',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-2',
      nickname: '법학도',
      avatarUrl: 'https://placehold.co/96x96/2563eb/ffffff?text=L',
    },
    summary: '법적 처벌 누락 사례',
    body: 'AI 오판으로 피해가 발생했지만 처벌 규정이 없어 무죄가 된 판례를 정리했습니다.',
    submittedAt: '2025-11-08T02:52:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-2',
        type: 'image',
        url: 'https://placehold.co/600x360/d1fae5/0f766e.png?text=Case+Study',
        thumbnailUrl: 'https://placehold.co/300x200/dbf4ff/0f766e.png?text=Evidence',
        sizeInBytes: 390_000,
        description: '판례 주요 문장',
      },
      {
        id: 'img-2-b',
        type: 'image',
        url: 'https://placehold.co/600x360/e0f2fe/0369a1.png?text=Verdict',
        thumbnailUrl: 'https://placehold.co/300x200/cbf1ff/0369a1.png?text=Verdict',
        sizeInBytes: 365_000,
        description: '판결 요약',
      },
      {
        id: 'img-2-c',
        type: 'image',
        url: 'https://placehold.co/600x360/f0fdfa/0f766e.png?text=Stats',
        thumbnailUrl: 'https://placehold.co/300x200/e0f2fe/0f766e.png?text=Stats',
        sizeInBytes: 372_000,
        description: '처벌 공백 통계',
      },
    ],
  },
  {
    id: 'evi-3',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-5',
      nickname: '데이터감독관',
      avatarUrl: 'https://placehold.co/96x96/f97316/ffffff?text=D',
    },
    summary: '벌금 부과 후 재발률',
    body: '규제 시범국에서 벌금 부과 후 재발률이 60% 감소한 데이터를 시각화했습니다.',
    submittedAt: '2025-11-08T02:56:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-3',
        type: 'image',
        url: 'https://placehold.co/600x360/fef3c7/b45309.png?text=Penalty+Data',
        thumbnailUrl: 'https://placehold.co/300x200/fffbeb/b45309.png?text=Penalty',
        sizeInBytes: 420_000,
        description: '벌금 vs 재발률 그래프',
      },
      {
        id: 'img-3-b',
        type: 'image',
        url: 'https://placehold.co/600x360/fde68a/b45309.png?text=Before',
        thumbnailUrl: 'https://placehold.co/300x200/fbfbea/b45309.png?text=Before',
        sizeInBytes: 360_000,
        description: '벌금 이전 데이터',
      },
    ],
  },
  {
    id: 'evi-4',
    roomId: 'room-mock-1',
    factionId: 'faction-alpha',
    author: {
      id: 'user-6',
      nickname: '시민감시자',
      avatarUrl: 'https://placehold.co/96x96/0ea5e9/ffffff?text=C',
    },
    summary: '피해 제보 지도',
    body: 'AI 채팅봇으로 인한 피해 제보 120건을 지역별로 표시했습니다.',
    submittedAt: '2025-11-08T03:00:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-4',
        type: 'image',
        url: 'https://placehold.co/600x360/fee2e2/b91c1c.png?text=Incident+Map',
        thumbnailUrl: 'https://placehold.co/300x200/fef2f2/b91c1c.png?text=Map',
        sizeInBytes: 405_000,
        description: '제보 위치 지도',
      },
      {
        id: 'img-4-b',
        type: 'image',
        url: 'https://placehold.co/600x360/fcd34d/b91c1c.png?text=Heatmap',
        thumbnailUrl: 'https://placehold.co/300x200/fef3c7/b91c1c.png?text=Heatmap',
        sizeInBytes: 398_000,
        description: '피해 빈도 히트맵',
      },
      {
        id: 'img-4-c',
        type: 'image',
        url: 'https://placehold.co/600x360/fde68a/b91c1c.png?text=Report',
        thumbnailUrl: 'https://placehold.co/300x200/fffbeb/b91c1c.png?text=Report',
        sizeInBytes: 360_000,
        description: '피해 사례 요약',
      },
    ],
  },
  {
    id: 'evi-5',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-3',
      nickname: '혁신개발자',
      avatarUrl: 'https://placehold.co/96x96/ea580c/ffffff?text=I',
    },
    summary: '규제 완화 시 투자 증가',
    body: '규제 샌드박스 이후 AI 스타트업 투자금이 2배 증가한 통계를 공유합니다.',
    submittedAt: '2025-11-08T03:04:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-5',
        type: 'image',
        url: 'https://placehold.co/600x360/f5f3ff/7c3aed.png?text=Investment',
        thumbnailUrl: 'https://placehold.co/300x200/ede9fe/7c3aed.png?text=Invest',
        sizeInBytes: 415_000,
        description: '투자금 추이 그래프',
      },
      {
        id: 'img-5-b',
        type: 'image',
        url: 'https://placehold.co/600x360/e0e7ff/4338ca.png?text=Growth',
        thumbnailUrl: 'https://placehold.co/300x200/c7d2fe/4338ca.png?text=Growth',
        sizeInBytes: 372_000,
        description: '투자 성장률',
      },
    ],
  },
  {
    id: 'evi-6',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-4',
      nickname: '시장자유론자',
      avatarUrl: 'https://placehold.co/96x96/22c55e/ffffff?text=F',
    },
    summary: '규제 비용 추정',
    body: '강력 규제 도입 시 기업당 연 120억 원의 추가 비용이 발생한다는 리포트입니다.',
    submittedAt: '2025-11-08T03:06:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-6',
        type: 'image',
        url: 'https://placehold.co/600x360/d1fae5/0f766e.png?text=Cost',
        thumbnailUrl: 'https://placehold.co/300x200/bad7f2/0f766e.png?text=Cost',
        sizeInBytes: 398_000,
        description: '규제 비용 표',
      },
      {
        id: 'img-6-b',
        type: 'image',
        url: 'https://placehold.co/600x360/f0fdfa/0f766e.png?text=Breakdown',
        thumbnailUrl: 'https://placehold.co/300x200/cffafe/0f766e.png?text=Breakdown',
        sizeInBytes: 384_000,
        description: '항목별 비용',
      },
    ],
  },
  {
    id: 'evi-7',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-7',
      nickname: '스타트업대표',
      avatarUrl: 'https://placehold.co/96x96/f59e0b/ffffff?text=S',
    },
    summary: '고용 창출 효과',
    body: '규제 완화 기간에 채용이 35% 증가한 자사 데이터를 공개합니다.',
    submittedAt: '2025-11-08T03:08:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-7',
        type: 'image',
        url: 'https://placehold.co/600x360/fde68a/b45309.png?text=Hiring',
        thumbnailUrl: 'https://placehold.co/300x200/fef3c7/b45309.png?text=Hiring',
        sizeInBytes: 360_000,
        description: '채용 추이 그래프',
      },
      {
        id: 'img-7-b',
        type: 'image',
        url: 'https://placehold.co/600x360/fef9c3/b45309.png?text=Teams',
        thumbnailUrl: 'https://placehold.co/300x200/fff7d6/b45309.png?text=Teams',
        sizeInBytes: 340_000,
        description: '팀 구성 변화',
      },
    ],
  },
  {
    id: 'evi-8',
    roomId: 'room-mock-1',
    factionId: 'faction-beta',
    author: {
      id: 'user-8',
      nickname: 'AI리서처',
      avatarUrl: 'https://placehold.co/96x96/14b8a6/ffffff?text=R',
    },
    summary: '자율 규제 프로토콜',
    body: '자체 검증 체크리스트를 공개해 규제 대신 투명한 보고가 가능함을 설명합니다.',
    submittedAt: '2025-11-08T03:10:00.000Z',
    status: 'submitted',
    media: [
      {
        id: 'img-8',
        type: 'image',
        url: 'https://placehold.co/600x360/cffafe/115e59.png?text=Protocol',
        thumbnailUrl: 'https://placehold.co/300x200/a5f3fc/115e59.png?text=Protocol',
        sizeInBytes: 372_000,
        description: '자율 규제 체크리스트',
      },
      {
        id: 'img-8-b',
        type: 'image',
        url: 'https://placehold.co/600x360/baf2e6/0f766e.png?text=SelfAudit',
        thumbnailUrl: 'https://placehold.co/300x200/a7f3d0/0f766e.png?text=SelfAudit',
        sizeInBytes: 365_000,
        description: '셀프 감사 항목',
      },
      {
        id: 'img-8-c',
        type: 'image',
        url: 'https://placehold.co/600x360/99f6e4/0f766e.png?text=Reporting',
        thumbnailUrl: 'https://placehold.co/300x200/6ee7b7/0f766e.png?text=Reporting',
        sizeInBytes: 350_000,
        description: '보고 프로세스',
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
  const factionsSnapshots = buildFactionSnapshots(teamStats, ROOM_DETAIL_EVIDENCE_ITEMS);
  const totalPoolPoints = factionsSnapshots.reduce((sum, stat) => sum + stat.totalBetPoints, 0);
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
    title: 'AI 규제 전면 토론',
    topic: 'AI에 대해 법적으로 강력한 규제가 필요하다',
    description:
      'AI 규제 필요/불필요 두 진영이 법적 규제의 강도와 시기, 혁신 영향력 등을 놓고 토론합니다.',
    createdAt,
    timeLimitMinutes,
    host,
    countdown: {
      endsAt,
    },
    factionInfos: ROOM_DETAIL_FACTIONS,
    betting: {
      totalPoolPoints,
      minBetPoints,
      factions: factionsSnapshots,
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

function cloneChatMessage(message: ChatMessage): ChatMessage {
  return JSON.parse(JSON.stringify(message)) as ChatMessage;
}

function cloneEvidenceItem(evidence: EvidenceItem): EvidenceItem {
  return JSON.parse(JSON.stringify(evidence)) as EvidenceItem;
}

function cloneParticipant(participant: Participant): Participant {
  return JSON.parse(JSON.stringify(participant)) as Participant;
}

function generateMockId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2)}`;
}

function buildRoomMeta(detail: RoomDetail): RoomMeta {
  const cloned = cloneRoomDetail(detail);
  const {
    id,
    title,
    topic,
    description,
    createdAt,
    timeLimitMinutes,
    host,
    countdown,
    factionInfos,
  } = cloned;

  return {
    id,
    title,
    topic,
    description,
    createdAt,
    timeLimitMinutes,
    host,
    countdown,
    factionInfos,
  };
}

function buildRoomParticipants(detail: RoomDetail): RoomParticipants {
  return {
    participants: cloneRoomDetail(detail).participants,
  };
}

function buildRoomBetting(detail: RoomDetail): RoomBettingState {
  return {
    betting: cloneRoomDetail(detail).betting,
  };
}

function buildRoomEvidence(detail: RoomDetail): RoomEvidenceState {
  return {
    evidenceGroups: cloneRoomDetail(detail).evidenceGroups,
  };
}

function buildRoomChat(detail: RoomDetail): RoomChatState {
  return {
    chatMessages: cloneRoomDetail(detail).chatMessages,
  };
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

  http.get('*/rooms/:roomId/meta', async ({ params }) => {
    const { roomId } = params as { roomId: string };
    const detail = getStoredRoomDetail(roomId);

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json({ meta: buildRoomMeta(detail) });
  }),

  http.get('*/rooms/:roomId/participants', async ({ params }) => {
    const { roomId } = params as { roomId: string };
    const detail = getStoredRoomDetail(roomId);

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json(buildRoomParticipants(detail));
  }),

  http.get('*/rooms/:roomId/betting', async ({ params }) => {
    const { roomId } = params as { roomId: string };
    const detail = getStoredRoomDetail(roomId);

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json(buildRoomBetting(detail));
  }),

  http.get('*/rooms/:roomId/evidence', async ({ params }) => {
    const { roomId } = params as { roomId: string };
    const detail = getStoredRoomDetail(roomId);

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json(buildRoomEvidence(detail));
  }),

  http.get('*/rooms/:roomId/chat', async ({ params }) => {
    const { roomId } = params as { roomId: string };
    const detail = getStoredRoomDetail(roomId);

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json(buildRoomChat(detail));
  }),

  http.get('*/rooms/:roomId/detail', async ({ params }) => {
    const { roomId } = params as { roomId: string };

    await delay(ROOM_DETAIL_DELAY_MS);

    return HttpResponse.json(cloneRoomDetail(getStoredRoomDetail(roomId)));
  }),

  http.get('*/rooms/:roomId/events', ({ params }) => {
    const { roomId } = params as { roomId: string };
    let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controllerRef = controller;
        const subscribers = getRoomEventSubscribers(roomId);
        subscribers.add(controller);
        controller.enqueue(textEncoder.encode(': connected\n\n'));
      },
      cancel() {
        if (controllerRef) {
          const subscribers = roomEventStreams.get(roomId);
          subscribers?.delete(controllerRef);
        }
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    });
  }),

  http.post('*/rooms/:roomId/end', async ({ params }) => {
    const { roomId } = params as { roomId: string };
    const now = Date.now();
    const endsAt = new Date(now + 60 * 1000).toISOString();

    broadcastRoomEvent(roomId, {
      type: 'room-ending',
      data: {
        endsAt,
        endsInSeconds: 60,
      },
    });

    setTimeout(() => {
      broadcastRoomEvent(roomId, {
        type: 'room-ended',
        data: {
          roomId,
          resultPath: `/rooms/${roomId}/result`,
        },
      });
    }, 500);

    return HttpResponse.json({ message: 'room end simulated' });
  }),

  http.post('*/rooms/:roomId/evidences', async ({ params, request }) => {
    const { roomId } = params as { roomId: string };
    const formData = await request.formData();

    const factionIdValue = formData.get('factionId');
    const authorIdValue = formData.get('authorId');
    const summaryValue = formData.get('summary');
    const bodyValue = formData.get('body');
    const imageEntries = formData.getAll('images');

    const payload = {
      factionId: typeof factionIdValue === 'string' ? factionIdValue : null,
      authorId: typeof authorIdValue === 'string' ? authorIdValue : null,
      summary: typeof summaryValue === 'string' ? summaryValue : null,
      body: typeof bodyValue === 'string' ? bodyValue : null,
      images: imageEntries.filter((file): file is File => file instanceof File),
    };

    const roomDetail = getStoredRoomDetail(roomId);

    if (!roomDetail) {
      return HttpResponse.json({ message: '존재하지 않는 방입니다.' }, { status: 404 });
    }

    if (!payload.factionId || !payload.authorId || !payload.summary || !payload.body) {
      return HttpResponse.json({ message: '필수 값이 누락되었어요.' }, { status: 400 });
    }

    const evidenceConstraints = ROOM_EVIDENCE_CONSTRAINTS;
    const maxBytes = evidenceConstraints.imageMaxSizeMb * 1024 * 1024;

    if (payload.body.length > evidenceConstraints.textMaxLength) {
      return HttpResponse.json(
        { message: `본문은 ${evidenceConstraints.textMaxLength}자 이하로 작성해 주세요.` },
        { status: 400 },
      );
    }

    const attachments = payload.images;

    if (attachments.length > evidenceConstraints.imageMaxCount) {
      return HttpResponse.json(
        { message: `이미지는 최대 ${evidenceConstraints.imageMaxCount}장까지 첨부할 수 있어요.` },
        { status: 400 },
      );
    }

    if (attachments.some((file) => file.size > maxBytes)) {
      return HttpResponse.json(
        { message: `${evidenceConstraints.imageMaxSizeMb}MB 이하 이미지만 첨부할 수 있어요.` },
        { status: 413 },
      );
    }

    const alreadySubmitted = roomDetail.evidenceGroups.some((group) =>
      group.submissions.some((submission) => submission.author.id === payload.authorId),
    );

    if (alreadySubmitted) {
      return HttpResponse.json(
        { message: '이미 증거를 제출했어요. 한 번만 제출할 수 있어요.' },
        { status: 409 },
      );
    }

    const factionSnapshot = roomDetail.betting.factions.find(
      (faction) => faction.id === payload.factionId,
    );
    if (!factionSnapshot) {
      return HttpResponse.json({ message: '존재하지 않는 진영입니다.' }, { status: 404 });
    }

    const authorProfile =
      roomDetail.participants.find((participant) => participant.id === payload.authorId) ?? null;

    if (!authorProfile) {
      return HttpResponse.json(
        { message: '방 참가자만 증거를 제출할 수 있어요.' },
        { status: 403 },
      );
    }

    if (authorProfile.factionId !== factionSnapshot.id) {
      return HttpResponse.json(
        { message: '해당 진영의 구성원만 증거를 제출할 수 있어요.' },
        { status: 403 },
      );
    }

    const evidenceFactionId = payload.factionId as TeamFactionId;

    const newEvidence: EvidenceItem = {
      id: generateMockId('evidence'),
      roomId,
      factionId: evidenceFactionId,
      author: authorProfile,
      summary: payload.summary,
      body: payload.body,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      media: attachments.map((file, index) => ({
        id: `${roomId}-evidence-media-${index}-${Date.now()}`,
        type: 'image',
        url: `https://placehold.co/600x360/faf5ff/6d28d9.png?text=${encodeURIComponent(
          file.name || `Evidence ${index + 1}`,
        )}`,
        sizeInBytes: file.size,
        thumbnailUrl: `https://placehold.co/300x200/ede9fe/6d28d9.png?text=${encodeURIComponent(
          file.name || `Evidence ${index + 1}`,
        )}`,
      })),
    };

    const targetGroup = roomDetail.evidenceGroups.find(
      (group) => group.factionId === evidenceFactionId,
    );

    if (targetGroup) {
      targetGroup.submissions = [newEvidence, ...targetGroup.submissions];
    } else {
      roomDetail.evidenceGroups.unshift({
        factionId: evidenceFactionId,
        factionName: factionSnapshot.name,
        submissions: [newEvidence],
      });
    }

    factionSnapshot.evidenceCount += 1;

    broadcastRoomEvent(roomId, {
      type: 'evidence-updated',
      data: {
        submission: cloneEvidenceItem(newEvidence),
        factionId: evidenceFactionId,
        factionName: factionSnapshot.name,
      },
    });

    return HttpResponse.json({
      evidenceGroups: cloneRoomDetail(roomDetail).evidenceGroups,
      message: '증거 제출이 완료되었어요.',
    });
  }),

  http.post('*/rooms/:roomId/chat-messages', async ({ params, request }) => {
    const { roomId } = params as { roomId: string };
    const body = (await request.json()) as {
      authorId?: string;
      factionId?: string;
      body?: string;
    };

    const roomDetail = getStoredRoomDetail(roomId);

    if (!roomDetail) {
      return HttpResponse.json({ message: '존재하지 않는 방입니다.' }, { status: 404 });
    }

    if (!body.authorId || !body.body) {
      return HttpResponse.json({ message: '작성자와 메시지가 필요해요.' }, { status: 400 });
    }

    const trimmedBody = body.body.trim();
    if (!trimmedBody) {
      return HttpResponse.json({ message: '메시지를 입력해 주세요.' }, { status: 400 });
    }

    const maxLength = ROOM_CHAT_CONSTRAINTS.maxLength;
    if (trimmedBody.length > maxLength) {
      return HttpResponse.json(
        { message: `메시지는 ${maxLength}자 이하로 입력해 주세요.` },
        { status: 400 },
      );
    }

    const authorParticipant = roomDetail.participants.find(
      (participant) => participant.id === body.authorId,
    );

    const authorProfile: ParticipantProfile = authorParticipant
      ? {
          id: authorParticipant.id,
          nickname: authorParticipant.nickname,
          avatarUrl: authorParticipant.avatarUrl,
        }
      : {
          id: body.authorId,
          nickname:
            body.authorId === MOCK_USER.userId ? (MOCK_USER.username ?? 'Mock User') : '익명',
          avatarUrl:
            body.authorId === MOCK_USER.userId
              ? (MOCK_USER.profileImageURL ?? undefined)
              : undefined,
        };

    const factionId = (body.factionId ??
      authorParticipant?.factionId ??
      TEAM_FACTION_NONE_ID) as TeamFactionId;

    const newMessage: ChatMessage = {
      id: generateMockId('chat'),
      roomId,
      factionId,
      author: {
        id: authorProfile.id,
        nickname: authorProfile.nickname,
        avatarUrl: authorProfile.avatarUrl,
      },
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    };

    roomDetail.chatMessages = [newMessage, ...roomDetail.chatMessages];

    broadcastRoomEvent(roomId, {
      type: 'chat-updated',
      data: {
        message: cloneChatMessage(newMessage),
      },
    });

    return HttpResponse.json({
      message: newMessage,
    });
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

    const factionSnapshot = roomDetail.betting.factions.find(
      (faction) => faction.id === body.factionId,
    );

    if (!factionSnapshot) {
      return HttpResponse.json({ message: '존재하지 않는 진영입니다.' }, { status: 404 });
    }

    factionSnapshot.totalBetPoints += body.points;
    roomDetail.betting.totalPoolPoints += body.points;

    const existingParticipant = roomDetail.participants.find(
      (participant) => participant.id === MOCK_USER.userId,
    );

    let participantForBroadcast: Participant;

    if (existingParticipant) {
      participantForBroadcast = existingParticipant;

      if (existingParticipant.factionId !== body.factionId) {
        const previousFaction = roomDetail.betting.factions.find(
          (faction) => faction.id === existingParticipant.factionId,
        );

        if (previousFaction && previousFaction.memberCount > 0) {
          previousFaction.memberCount -= 1;
        }

        existingParticipant.factionId = body.factionId as TeamFactionId;
        factionSnapshot.memberCount += 1;
      }

      existingParticipant.totalBetPoints += body.points;
    } else {
      roomDetail.participants = [
        ...roomDetail.participants,
        {
          id: MOCK_USER.userId,
          nickname: MOCK_USER.username ?? 'Mock User',
          avatarUrl: MOCK_USER.profileImageURL ?? undefined,
          factionId: body.factionId as TeamFactionId,
          role: 'member',
          joinedAt: new Date().toISOString(),
          totalBetPoints: body.points,
        },
      ];
      factionSnapshot.memberCount += 1;
      participantForBroadcast = roomDetail.participants[roomDetail.participants.length - 1];
    }

    const clonedDetail = cloneRoomDetail(roomDetail);

    broadcastRoomEvent(roomId, {
      type: 'participant-updated',
      data: {
        participant: cloneParticipant(participantForBroadcast),
      },
    });

    broadcastRoomEvent(roomId, {
      type: 'betting-updated',
      data: {
        betting: clonedDetail.betting,
      },
    });

    return HttpResponse.json({
      betting: clonedDetail.betting,
      participants: clonedDetail.participants,
      message: '배팅이 완료되었어요.',
    });
  }),
];

function getRoomEventSubscribers(roomId: string) {
  let subscribers = roomEventStreams.get(roomId);
  if (!subscribers) {
    subscribers = new Set();
    roomEventStreams.set(roomId, subscribers);
  }
  return subscribers;
}

function broadcastRoomEvent(roomId: string, event: { type: string; data?: unknown }) {
  const subscribers = roomEventStreams.get(roomId);
  if (!subscribers || subscribers.size === 0) {
    return;
  }

  const payload = `event: ${event.type}\ndata: ${JSON.stringify(event.data ?? {})}\n\n`;
  const chunk = textEncoder.encode(payload);

  subscribers.forEach((controller) => {
    try {
      controller.enqueue(chunk);
    } catch (_error) {
      subscribers.delete(controller);
    }
  });
}
