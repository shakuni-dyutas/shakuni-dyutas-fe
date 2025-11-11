import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { type UseFormReturn, useForm } from 'react-hook-form';

import type { RoomBettingState, RoomFactionSnapshot } from '@/entities/room/types/room-detail';
import { calcExpectedReturn } from '@/features/bet-place/lib/calc-expected-return';
import {
  type BetFormValues,
  createBetFormSchema,
} from '@/features/bet-place/model/bet-form-schema';

interface UseBetFormParams {
  factions: RoomFactionSnapshot[];
  betting: RoomBettingState['betting'];
}

interface UseBetFormResult {
  form: UseFormReturn<BetFormValues>;
  selectedFactionId: string;
  setSelectedFactionId: (id: string) => void;
  points: string;
  handlePointsChange: (value: string) => void;
  handleQuickAdd: (value: number) => void;
  resetPoints: () => void;
  minBetPoints: number;
  selectedSnapshot: RoomBettingState['betting']['factions'][number] | undefined;
  otherPoolPoints: number;
  expectedReturn: number;
}

function useBetForm({ factions, betting }: UseBetFormParams): UseBetFormResult {
  const minBetPoints = betting.minBetPoints;
  const schema = useMemo(() => createBetFormSchema(minBetPoints), [minBetPoints]);

  const form = useForm<BetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      factionId: factions[0]?.id ?? '',
      points: '',
    },
    mode: 'onChange',
  });

  const selectedFactionId = form.watch('factionId');
  const points = form.watch('points');

  useEffect(() => {
    const current = form.getValues('factionId');
    if (!factions.some((faction) => faction.id === current)) {
      form.setValue('factionId', factions[0]?.id ?? '', { shouldValidate: true });
    }
  }, [factions, form]);

  const selectedSnapshot = useMemo(() => {
    const targetId = selectedFactionId || factions[0]?.id;
    return betting.factions.find((snapshot) => snapshot.factionId === targetId);
  }, [betting.factions, factions, selectedFactionId]);

  const otherPoolPoints = useMemo(() => {
    if (!selectedSnapshot) {
      return betting.totalPoolPoints;
    }

    return Math.max(betting.totalPoolPoints - selectedSnapshot.totalBetPoints, 0);
  }, [betting.totalPoolPoints, selectedSnapshot]);

  const expectedReturn = useMemo(() => {
    const stakeValue = Number(points);

    if (!selectedSnapshot || Number.isNaN(stakeValue) || stakeValue <= 0) {
      return 0;
    }

    return calcExpectedReturn({
      stake: stakeValue,
      myTeamPool: selectedSnapshot.totalBetPoints,
      otherTeamPool: otherPoolPoints,
    });
  }, [otherPoolPoints, points, selectedSnapshot]);

  const handlePointsChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    const normalized = digitsOnly.replace(/^0+(?=\d)/, '');
    form.setValue('points', normalized, { shouldValidate: true, shouldDirty: true });
  };

  const handleQuickAdd = (value: number) => {
    const current = Number(form.getValues('points')) || 0;
    const nextValue = Math.max(current + value, 0);
    form.setValue('points', String(nextValue), { shouldValidate: true, shouldDirty: true });
  };

  const resetPoints = () => {
    form.setValue('points', '', { shouldValidate: true, shouldDirty: true });
  };

  const setSelectedFaction = (id: string) => {
    form.setValue('factionId', id, { shouldValidate: true, shouldDirty: true });
  };

  return {
    form,
    selectedFactionId,
    setSelectedFactionId: setSelectedFaction,
    points,
    handlePointsChange,
    handleQuickAdd,
    resetPoints,
    minBetPoints,
    selectedSnapshot,
    otherPoolPoints,
    expectedReturn,
  };
}

export type { UseBetFormParams, UseBetFormResult, BetFormValues };
export { useBetForm };
