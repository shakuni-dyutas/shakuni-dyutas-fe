import type { ParticipantProfile } from '@/entities/participant/types/participant';
import type { TeamFaction } from '@/entities/team/types/team-faction';

/**
 * 게임 결과 타입
 * - consensus: 합의로 종료
 * - ai_judgment: AI 판정으로 종료
 * - timeout: 시간 초과
 */
export type RoomResultType = 'consensus' | 'ai_judgment' | 'timeout';

/**
 * AI 분석 평가 요소
 */
export interface RoomResultAnalysisFactor {
  factor: string;
  teamAScore: number;
  teamBScore: number;
}

/**
 * AI 분석 결과
 */
export interface RoomResultAiAnalysis {
  summary: string;
  keyPoints: RoomResultAnalysisFactor[];
  conclusion: string;
  teamAOverallScore: number;
  teamBOverallScore: number;
}

/**
 * 진영별 결과 통계
 */
export interface RoomResultFactionStats {
  faction: TeamFaction;
  participantCount: number;
  totalBetPoints: number;
  ratio: number;
}

/**
 * 사용자 개인 결과
 */
export interface RoomResultUserResult {
  participated: boolean;
  factionId: string | null;
  bettingAmount: number;
  earnedAmount: number;
  isWinner: boolean;
}

/**
 * 방 결과 전체 데이터
 */
export interface RoomResult {
  id: string;
  title: string;
  description: string;
  topic: string;
  host: ParticipantProfile;
  resultType: RoomResultType;
  winnerFactionId: string;
  factionStats: RoomResultFactionStats[];
  aiAnalysis: RoomResultAiAnalysis | null;
  userResult: RoomResultUserResult;
  totalParticipants: number;
  totalBetPoints: number;
  endedAt: string;
  createdAt: string;
}
