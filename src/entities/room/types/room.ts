// Room domain types (entities)

// 실제 도메인 상태만 표현
export type RoomStatus = 'active' | 'ended';

export interface Room {
  id: string;
  title: string;
  description: string;
  team_a: string;
  team_b: string;
  participants: number;
  max_participants: number;
  time_left: string; // e.g. "2h 15m"
  total_betting: number;
  team_a_ratio: number; // 0-100
  team_b_ratio: number; // 0-100
  status: RoomStatus;
  created_at: string; // ISO datetime
}

// 뷰 탭(파생 라벨)과 정렬/검색을 포함한 필터
export interface RoomFilters {
  // 파생 탭: active|hot|new|ended
  // 'hot', 'new': 'active' 상태의 방들을 추가 기준으로 필터링/
  status?: 'active' | 'ended'; // 실제 백엔드 필터
  view?: 'active' | 'hot' | 'new' | 'ended';
  search?: string;
  sort?: 'latest' | 'betting' | 'participants';
}
