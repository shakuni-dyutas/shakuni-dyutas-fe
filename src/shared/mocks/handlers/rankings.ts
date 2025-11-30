import { HttpResponse, http } from 'msw';

import { MOCK_USER } from './constants';

type RankingUserMock = {
  userId: string;
  rank: number;
  nickname: string;
  avatarUrl: string | null;
  points: number;
  wins: number;
  loses: number;
  winRate: number;
  streak: number;
  isCurrentUser: boolean;
};

const CURRENT_USER_RANK = MOCK_USER.rank ?? 12;

const RANKING_COLLECTION: RankingUserMock[] = Array.from({ length: 30 }).map((_, index) => {
  const rank = index + 1;
  const isCurrentUser = rank === CURRENT_USER_RANK;
  const wins = isCurrentUser ? MOCK_USER.wins : Math.max(10, 60 - index);
  const loses = isCurrentUser ? MOCK_USER.loses : 15 + index;
  const totalGames = wins + loses;
  const winRate = Math.min(99, Math.max(35, Math.round((wins / totalGames) * 100)));

  return {
    userId: isCurrentUser ? MOCK_USER.userId : `ranking-user-${rank}`,
    rank,
    nickname: isCurrentUser
      ? (MOCK_USER.username ?? 'Dyutas Player')
      : `player-${String(rank).padStart(2, '0')}`,
    avatarUrl: rank <= 3 ? `https://cdn.dyutas.app/avatars/${rank}.png` : null,
    points: isCurrentUser ? MOCK_USER.points : 50000 - index * 500,
    wins,
    loses,
    winRate,
    streak: isCurrentUser ? 3 : (index % 5) + 1,
    isCurrentUser,
  };
});

function buildRankingUserMock(overrides: Partial<RankingUserMock> = {}): RankingUserMock {
  const rank = overrides.rank ?? RANKING_COLLECTION.length + 1;

  const base: RankingUserMock = {
    userId: `ranking-user-${rank}`,
    rank,
    nickname: `player-${String(rank).padStart(2, '0')}`,
    avatarUrl: null,
    points: 40000 - rank * 100,
    wins: 25,
    loses: 10,
    winRate: 71,
    streak: 2,
    isCurrentUser: false,
  };

  return {
    ...base,
    ...overrides,
  };
}

function parseNumber(value: string | null, fallback: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

async function handleGetRankings({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const offset = parseNumber(url.searchParams.get('offset'), 0);
    const limit = parseNumber(url.searchParams.get('limit'), 20);

    const podium = RANKING_COLLECTION.slice(0, 3);
    const listCollection = RANKING_COLLECTION.slice(3);

    const slice = listCollection.slice(offset, offset + limit);
    const nextOffset = offset + limit < listCollection.length ? offset + limit : null;
    const myRank = RANKING_COLLECTION.find((item) => item.isCurrentUser)?.rank ?? null;

    return HttpResponse.json({
      podium,
      items: slice,
      total: RANKING_COLLECTION.length,
      nextOffset,
      myRank,
      hasMore: nextOffset !== null,
    });
  } catch (error) {
    console.error('ranking handler error', error);
    return HttpResponse.json({ message: 'mock error' }, { status: 500 });
  }
}

const rankingHandlers = [http.get('*/rankings', handleGetRankings)];

export { RANKING_COLLECTION, buildRankingUserMock, rankingHandlers };
