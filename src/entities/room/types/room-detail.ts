import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant, ParticipantProfile } from '@/entities/participant/types/participant';
import type { TeamBettingSnapshot, TeamFaction } from '@/entities/team/types/team-faction';

export interface RoomCountdown {
  endsAt: string;
  remainingSeconds: number;
}

export interface RoomRestrictionConfig {
  minBetPoints: number;
  evidence: {
    textMaxLength: number;
    imageMaxSizeMb: number;
    imageMaxCount: number;
  };
  chat: {
    maxLength: number;
  };
}

export interface RoomFactionSnapshot extends TeamFaction {
  memberCount: number;
  totalBetPoints: number;
  evidenceCount: number;
}

export interface RoomEvidenceGroup {
  factionId: RoomFactionSnapshot['id'];
  factionName: string;
  submissions: EvidenceItem[];
}

export interface RoomBettingSnapshot {
  totalPoolPoints: number;
  minBetPoints: number;
  factions: TeamBettingSnapshot[];
}

export interface RoomDetail {
  id: string;
  title: string;
  topic: string;
  description: string;
  createdAt: string;
  timeLimitMinutes: number;
  host: ParticipantProfile;
  countdown: RoomCountdown;
  restrictions: RoomRestrictionConfig;
  factions: RoomFactionSnapshot[];
  betting: RoomBettingSnapshot;
  participants: Participant[];
  evidenceGroups: RoomEvidenceGroup[];
  chatMessages: ChatMessage[];
}
