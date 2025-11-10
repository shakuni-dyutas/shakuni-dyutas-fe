import type { ParticipantProfile } from '@/entities/participant/types/participant';
import type { TeamFactionId } from '@/entities/team/types/team-faction';

export type EvidenceStatus = 'draft' | 'submitted' | 'locked';

export interface EvidenceMedia {
  id: string;
  type: 'image';
  url: string;
  sizeInBytes: number;
  thumbnailUrl?: string;
  description?: string;
}

export interface EvidenceItem {
  id: string;
  roomId: string;
  factionId: TeamFactionId;
  author: ParticipantProfile;
  summary: string;
  body: string;
  submittedAt: string;
  status: EvidenceStatus;
  media: EvidenceMedia[];
}
