import type { ParticipantProfile } from '@/entities/participant/types/participant';
import type { TeamFactionId } from '@/entities/team/types/team-faction';

export type ChatAttachmentType = 'image' | 'link';

export interface ChatAttachment {
  id: string;
  type: ChatAttachmentType;
  url: string;
  title?: string;
  thumbnailUrl?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  factionId: TeamFactionId;
  author: ParticipantProfile;
  body: string;
  createdAt: string; // ISO datetime
  isSystem?: boolean;
  attachments?: ChatAttachment[];
}
