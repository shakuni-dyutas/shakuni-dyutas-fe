/**
 * Room detail 화면에서 사용하는 도메인 상수
 */

export const ROOM_EVIDENCE_CONSTRAINTS = {
  TEXT_MAX_LENGTH: 1000,
  IMAGE_MAX_SIZE_MB: 3,
  IMAGE_MAX_COUNT: 3,
} as const;

export const ROOM_CHAT_CONSTRAINTS = {
  MAX_LENGTH: 500,
} as const;

export const ROOM_FACTION_COLOR_SEQUENCE = [
  '#EF4444',
  '#2563EB',
  '#F97316',
  '#10B981',
  '#A855F7',
] as const;

export function getRoomFactionColor(index: number): string {
  const normalizedIndex =
    ((index % ROOM_FACTION_COLOR_SEQUENCE.length) + ROOM_FACTION_COLOR_SEQUENCE.length) %
    ROOM_FACTION_COLOR_SEQUENCE.length;
  return ROOM_FACTION_COLOR_SEQUENCE[normalizedIndex];
}

export const ROOM_COUNTDOWN_PLACEHOLDER = {
  DEFAULT_DURATION_MINUTES: 45,
} as const;
