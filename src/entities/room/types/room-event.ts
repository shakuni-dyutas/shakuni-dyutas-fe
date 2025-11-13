import type { ChatMessage } from '@/entities/chat/types/chat-message';
import type { EvidenceItem } from '@/entities/evidence/types/evidence';
import type { Participant } from '@/entities/participant/types/participant';
import type { RoomBettingState, RoomMeta } from '@/entities/room/types/room-detail';

interface ChatUpdatedEvent {
  type: 'chat-updated';
  data: {
    message: ChatMessage;
  };
}

interface EvidenceUpdatedEvent {
  type: 'evidence-updated';
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

interface BettingUpdatedEvent {
  type: 'betting-updated';
  data: {
    betting: RoomBettingState['betting'];
    factions: RoomMeta['factions'];
  };
}

interface KeepAliveEvent {
  type: 'keep-alive';
}

export type RoomServerEvent =
  | ChatUpdatedEvent
  | EvidenceUpdatedEvent
  | ParticipantUpdatedEvent
  | BettingUpdatedEvent
  | KeepAliveEvent;
