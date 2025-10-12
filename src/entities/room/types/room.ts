// Room domain types (entities)

export type RoomStatus = 'active' | 'ended' | 'new' | 'hot';

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

export interface RoomFilters {
  status?: RoomStatus;
  search?: string;
  sort?: 'latest' | 'betting' | 'participants';
}
