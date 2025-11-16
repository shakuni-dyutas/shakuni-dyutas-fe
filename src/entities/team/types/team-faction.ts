export type TeamFactionId = `faction-${string}`;

export interface TeamFaction {
  id: TeamFactionId;
  name: string;
  description?: string;
  color?: string; // HEX
}

export interface TeamBettingSnapshot {
  factionId: TeamFactionId;
  participantCount: number;
  totalBetPoints: number;
  averageBetPoints: number;
}
