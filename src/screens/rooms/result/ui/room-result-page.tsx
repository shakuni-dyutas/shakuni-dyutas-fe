'use client';

import { Coins, Scale, TrendingDown, TrendingUp, Trophy, Users } from 'lucide-react';
import type { RoomResult } from '@/entities/room/types/room-result';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { ComparisonBar } from '@/shared/ui/comparison-bar';
import { ScoreDonut } from '@/shared/ui/score-donut';

interface RoomResultPageProps {
  result: RoomResult;
  onBackToLobby?: () => void;
  onCreateNewRoom?: () => void;
}

function RoomResultPage({ result, onBackToLobby, onCreateNewRoom }: RoomResultPageProps) {
  const winner_faction_stats = result.factionStats.find(
    (stats) => stats.faction.id === result.winnerFactionId,
  );

  const faction_a = result.factionStats[0];
  const faction_b = result.factionStats[1];

  const getResultTypeLabel = () => {
    switch (result.resultType) {
      case 'consensus':
        return '합의 종료';
      case 'ai_judgment':
        return 'AI 판정';
      case 'timeout':
        return '시간 초과';
      default:
        return '종료';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-2 bg-primary-foreground/20 text-primary-foreground"
          >
            {getResultTypeLabel()}
          </Badge>
          <h1 className="mb-1 font-bold text-2xl leading-tight">{result.title}</h1>
          <p className="text-primary-foreground/80 text-sm">{result.description}</p>

          {/* Winner Banner */}
          {winner_faction_stats && (
            <Card className="mt-4 border-0 bg-primary-foreground/10 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                  <Trophy className="size-7 text-amber-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-primary-foreground/70 text-sm">승리 진영</p>
                  <p className="truncate font-bold text-amber-500 text-lg">
                    {winner_faction_stats.faction.name}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-primary-foreground/80 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="size-4" />
                      <span>{winner_faction_stats.participantCount}명</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="size-4" />
                      <span>{winner_faction_stats.totalBetPoints.toLocaleString()}P</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6">
        {/* User Result Card */}
        {result.userResult.participated && (
          <Card
            className={`border-2 ${
              result.userResult.isWinner
                ? 'border-amber-500/50 bg-amber-500/5'
                : 'border-destructive/50 bg-destructive/5'
            }`}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {result.userResult.isWinner ? (
                  <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/20">
                    <TrendingUp className="size-5 text-amber-500" />
                  </div>
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-destructive/20">
                    <TrendingDown className="size-5 text-destructive" />
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground text-sm">내 결과</p>
                  <p className="font-bold">
                    {
                      result.factionStats.find((s) => s.faction.id === result.userResult.factionId)
                        ?.faction.name
                    }{' '}
                    • {result.userResult.bettingAmount.toLocaleString()}P 배팅
                  </p>
                </div>
              </div>
              <div
                className={`text-right ${result.userResult.isWinner ? 'text-amber-500' : 'text-destructive'}`}
              >
                <p className="font-bold text-2xl">
                  {result.userResult.isWinner ? '+' : '-'}
                  {result.userResult.isWinner
                    ? result.userResult.earnedAmount
                    : result.userResult.bettingAmount}
                  P
                </p>
                <p className="text-sm">{result.userResult.isWinner ? '획득' : '손실'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis Section */}
        {result.aiAnalysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              <h2 className="font-bold text-lg">AI 판정 분석</h2>
            </div>

            {/* Summary */}
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {result.aiAnalysis.summary}
                </p>
              </CardContent>
            </Card>

            {/* Team Score Donut Charts */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="flex flex-col items-center p-4">
                  <ScoreDonut
                    score={result.aiAnalysis.teamAOverallScore}
                    size="md"
                    color="hsl(var(--chart-1))"
                    label={faction_a?.faction.name}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-4">
                  <ScoreDonut
                    score={result.aiAnalysis.teamBOverallScore}
                    size="md"
                    color="hsl(var(--chart-2))"
                    label={faction_b?.faction.name}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Key Factors */}
            <Card>
              <CardContent className="space-y-4 p-4">
                <h3 className="font-semibold">평가 요소별 점수</h3>
                <div className="space-y-4">
                  {result.aiAnalysis.keyPoints.slice(0, 3).map((point) => (
                    <ComparisonBar
                      key={point.factor}
                      label={point.factor}
                      valueA={point.teamAScore}
                      valueB={point.teamBScore}
                      labelA="A"
                      labelB="B"
                      colorA="hsl(var(--chart-1))"
                      colorB="hsl(var(--chart-2))"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold text-primary">최종 결론</h3>
                <p className="text-sm leading-relaxed">{result.aiAnalysis.conclusion}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Final Stats */}
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-4 font-semibold">최종 통계</h3>

            <div className="grid grid-cols-2 gap-4">
              {result.factionStats.map((stats) => (
                <div
                  key={stats.faction.id}
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor:
                      stats.faction.id === result.factionStats[0]?.faction.id
                        ? 'hsl(var(--chart-1) / 0.1)'
                        : 'hsl(var(--chart-2) / 0.1)',
                  }}
                >
                  <p className="mb-1 text-muted-foreground text-xs">
                    {stats.faction.id === result.factionStats[0]?.faction.id
                      ? 'Faction A'
                      : 'Faction B'}
                  </p>
                  <p
                    className="truncate font-bold"
                    style={{
                      color:
                        stats.faction.id === result.factionStats[0]?.faction.id
                          ? 'hsl(var(--chart-1))'
                          : 'hsl(var(--chart-2))',
                    }}
                  >
                    {stats.faction.name}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>{stats.participantCount}명 참여</p>
                    <p>{stats.totalBetPoints.toLocaleString()}P</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-border border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">총 참여자</span>
                <span className="font-medium">{result.totalParticipants}명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">총 배팅 포인트</span>
                <span className="font-medium text-amber-600">
                  {result.totalBetPoints.toLocaleString()}P
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full" onClick={onBackToLobby}>
            로비로 돌아가기
          </Button>
          <Button variant="outline" className="w-full" onClick={onCreateNewRoom}>
            새 토론 만들기
          </Button>
        </div>
      </div>
    </div>
  );
}

export { RoomResultPage };
export type { RoomResultPageProps };
