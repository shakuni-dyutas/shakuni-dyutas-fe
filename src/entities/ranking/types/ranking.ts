interface RankingUser {
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
}

interface RankingList {
  podium: RankingUser[];
  items: RankingUser[];
  total: number;
  nextOffset: number | null;
  hasMore: boolean;
  offset: number;
  limit: number;
  myRank: number | null;
}

export type { RankingList, RankingUser };
