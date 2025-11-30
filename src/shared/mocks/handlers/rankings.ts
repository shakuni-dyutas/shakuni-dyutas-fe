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

function filterBySearch(collection: RankingUserMock[], rawSearch: string) {
  const normalized = rawSearch.trim().toLowerCase();

  if (!normalized) {
    return collection;
  }

  return collection.filter((item) => item.nickname.toLowerCase().includes(normalized));
}

function resolveOffsetWithAround(
  collection: RankingUserMock[],
  requestedOffset: number,
  limit: number,
  around: string | null,
) {
  if (around !== 'me') {
    return requestedOffset;
  }

  const currentIndex = collection.findIndex((item) => item.isCurrentUser);

  if (currentIndex === -1) {
    return requestedOffset;
  }

  const halfWindow = Math.floor(limit / 2);
  return Math.max(0, currentIndex - halfWindow);
}

async function handleGetRankings({ request }: { request: Request }) {
  const url = new URL(request.url);
  const offset = parseNumber(url.searchParams.get('offset'), 0);
  const limit = parseNumber(url.searchParams.get('limit'), 20);
  const search = url.searchParams.get('search') ?? '';
  const around = url.searchParams.get('around');

  const filtered = filterBySearch(RANKING_COLLECTION, search);
  const podium = filtered.slice(0, 3);
  const listCollection = filtered.slice(3);
  const effectiveOffset = resolveOffsetWithAround(listCollection, offset, limit, around);

  const slice = listCollection.slice(effectiveOffset, effectiveOffset + limit);
  const nextOffset =
    effectiveOffset + limit < listCollection.length ? effectiveOffset + limit : null;
  const myRank = filtered.find((item) => item.isCurrentUser)?.rank ?? null;

  return HttpResponse.json({
    podium,
    items: slice,
    total: filtered.length,
    nextOffset,
    myRank,
    hasMore: nextOffset !== null,
  });
}

const rankingHandlers = [http.get('*/api/rankings', handleGetRankings)];

export { RANKING_COLLECTION, buildRankingUserMock, rankingHandlers };
