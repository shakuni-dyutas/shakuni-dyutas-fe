const ROOM_QUERY_BASE_KEY = 'room';

const ROOM_QUERY_KEYS = {
  detail: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'detail', roomId] as const,
} as const;

export { ROOM_QUERY_KEYS };
