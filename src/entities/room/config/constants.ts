/**
 * Room detail 화면에서 사용하는 도메인 상수
 */

export const ROOM_EVIDENCE_CONSTRAINTS = {
  textMaxLength: 2000,
  imageMaxSizeMb: 5,
  imageMaxCount: 5,
} as const;

export const ROOM_CHAT_CONSTRAINTS = {
  maxLength: 250,
} as const;

export const ROOM_FACTION_COLOR_SEQUENCE = [
  '#EF4444',
  '#2563EB',
  '#F97316',
  '#10B981',
  '#A855F7',
  '#F59E0B',
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
