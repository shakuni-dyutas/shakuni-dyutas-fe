const CREATE_ROOM_MIN_FACTION_COUNT = 1;
const CREATE_ROOM_MAX_FACTION_COUNT = 6;

interface CreateRoomFactionValues {
  title: string;
  description: string;
}

interface CreateRoomFormValues {
  title: string;
  description: string;
  timeLimitMinutes: string;
  minBetPoint: string;
  visibility: 'public' | 'private';
  password: string;
  factions: CreateRoomFactionValues[];
}

type CreateRoomVisibility = CreateRoomFormValues['visibility'];

export { CREATE_ROOM_MAX_FACTION_COUNT, CREATE_ROOM_MIN_FACTION_COUNT };
export type { CreateRoomFactionValues, CreateRoomFormValues, CreateRoomVisibility };
