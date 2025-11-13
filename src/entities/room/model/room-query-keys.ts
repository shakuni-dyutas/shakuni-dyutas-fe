const ROOM_QUERY_BASE_KEY = 'room';

const ROOM_QUERY_KEYS = {
  detail: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'detail', roomId] as const,
  meta: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'meta', roomId] as const,
  participants: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'participants', roomId] as const,
  betting: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'betting', roomId] as const,
  evidence: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'evidence', roomId] as const,
  chat: (roomId: string) => [ROOM_QUERY_BASE_KEY, 'chat', roomId] as const,
} as const;

export { ROOM_QUERY_KEYS };
