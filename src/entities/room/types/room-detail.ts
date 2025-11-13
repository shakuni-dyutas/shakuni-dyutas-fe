import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant, ParticipantProfile } from '@/entities/participant/types/participant';
import type { TeamBettingSnapshot, TeamFaction } from '@/entities/team/types/team-faction';

export interface RoomCountdown {
  endsAt: string;
  remainingSeconds: number;
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

export interface RoomMeta {
  id: string;
  title: string;
  topic: string;
  description: string;
  createdAt: string;
  timeLimitMinutes: number;
  host: ParticipantProfile;
  countdown: RoomCountdown;
  factions: RoomFactionSnapshot[];
}

export interface RoomParticipants {
  participants: Participant[];
}

export interface RoomBettingState {
  betting: RoomBettingSnapshot;
}

export interface RoomEvidenceState {
  evidenceGroups: RoomEvidenceGroup[];
}

export interface RoomChatState {
  chatMessages: ChatMessage[];
}

export interface RoomDetailDomains {
  meta: RoomMeta;
  participants: RoomParticipants;
  betting: RoomBettingState;
  evidence: RoomEvidenceState;
  chat: RoomChatState;
}

export type RoomDetail = RoomMeta &
  RoomParticipants &
  RoomBettingState &
  RoomEvidenceState &
  RoomChatState;
