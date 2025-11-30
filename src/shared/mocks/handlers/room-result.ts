import { HttpResponse, http } from 'msw';

import type { RoomResult } from '@/entities/room/types/room-result';

const MOCK_ROOM_RESULT: RoomResult = {
  id: 'room-123',
  title: 'AI는 인간의 창작을 대체할 수 있는가?',
  description: '인공지능이 창작 산업에 미치는 영향에 대한 토론',
  topic: 'AI와 창작',
  host: {
    id: 'host-1',
    nickname: '토론왕',
    avatarUrl: null,
  },
  resultType: 'ai_judgment',
  winnerFactionId: 'faction-a',
  factionStats: [
    {
      faction: {
        id: 'faction-a',
        name: 'AI는 창작을 확장한다',
        description: 'AI는 창작의 도구',
      },
      participantCount: 15,
      totalBetPoints: 9800,
      ratio: 65,
    },
    {
      faction: {
        id: 'faction-b',
        name: 'AI는 창작을 위협한다',
        description: 'AI는 창작의 적',
      },
      participantCount: 9,
      totalBetPoints: 5620,
      ratio: 35,
    },
  ],
  aiAnalysis: {
    summary:
      'AI 판사가 양 진영의 논거를 분석한 결과, Faction A의 주장이 더 논리적이고 근거가 풍부한 것으로 판단되었습니다.',
    keyPoints: [
      {
        factor: '논리성',
        teamAScore: 85,
        teamBScore: 72,
      },
      {
        factor: '근거 신뢰도',
        teamAScore: 78,
        teamBScore: 65,
      },
      {
        factor: '참여도',
        teamAScore: 90,
        teamBScore: 68,
      },
    ],
    conclusion:
      'AI는 인간의 창작을 대체하는 것이 아니라, 새로운 도구로서 창작의 가능성을 확장시키고 있습니다. 역사적으로 카메라, 컴퓨터 등 새로운 기술이 등장할 때마다 유사한 우려가 있었지만, 결과적으로 예술가들에게 더 다양한 표현 수단을 제공했습니다.',
    teamAOverallScore: 84,
    teamBOverallScore: 68,
  },
  userResult: {
    participated: true,
    factionId: 'faction-a',
    bettingAmount: 500,
    earnedAmount: 285,
    isWinner: true,
  },
  totalParticipants: 24,
  totalBetPoints: 15420,
  endedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3시간 전
};

export const roomResultHandlers = [
  http.get('*/rooms/:roomId/result', ({ params }) => {
    const { roomId } = params;

    // 방을 찾지 못한 경우
    if (roomId === 'not-found') {
      return HttpResponse.json(
        {
          error: 'Room not found',
          message: '방을 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    // 아직 종료되지 않은 방
    if (roomId === 'not-ended') {
      return HttpResponse.json(
        {
          error: 'Room not ended',
          message: '아직 종료되지 않은 방입니다.',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      data: {
        ...MOCK_ROOM_RESULT,
        id: roomId as string,
      },
    });
  }),
];
