import type { TeamFactionId } from '@/entities/team/types/team-faction';

export type ParticipantRole = 'host' | 'member' | 'observer';

export interface ParticipantProfile {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface Participant extends ParticipantProfile {
  factionId: TeamFactionId;
  role: ParticipantRole;
  joinedAt: string; // ISO datetime
  totalBetPoints: number;
}

export interface ParticipantSummary {
  factionId: TeamFactionId;
  memberCount: number;
}
