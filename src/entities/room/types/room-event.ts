import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant } from '@/entities/participant/types/participant';

interface ChatCreatedEvent {
  type: 'chat-created';
  data: {
    message: ChatMessage;
  };
}

interface EvidenceSubmittedEvent {
  type: 'evidence-submitted';
  data: {
    submission: EvidenceItem;
    factionId: string;
    factionName: string;
  };
}

interface ParticipantUpdatedEvent {
  type: 'participant-updated';
  data: {
    participant: Participant;
  };
}

interface KeepAliveEvent {
  type: 'keep-alive';
}

export type RoomServerEvent =
  | ChatCreatedEvent
  | EvidenceSubmittedEvent
  | ParticipantUpdatedEvent
  | KeepAliveEvent;
