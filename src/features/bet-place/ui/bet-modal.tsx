'use client';

import { overlay } from 'overlay-kit';
import { type AnimationEvent, useRef } from 'react';

import type { RoomBettingState, RoomFactionSnapshot } from '@/entities/room/types/room-detail';
import type { PostRoomBetResponse } from '@/features/bet-place/api/post-room-bet';
import { BET_QUICK_ADD_POINTS } from '@/features/bet-place/config/constants';
import { useBetForm } from '@/features/bet-place/model/use-bet-form';
import { useBetMutation } from '@/features/bet-place/model/use-bet-mutation';
import { cn } from '@/shared/lib/utils';
import { ReactQueryProvider } from '@/shared/providers/react-query-provider';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

interface BetModalOptions {
  roomId: string;
  roomTitle: string;
  factions: RoomFactionSnapshot[];
  betting: RoomBettingState['betting'];
  onSuccess?: (response: PostRoomBetResponse) => void;
}

interface BetModalControllerProps extends BetModalOptions {
  overlayId: string;
  isOpen: boolean;
  close: (result: null) => void;
  unmount: () => void;
}

function BetModalController({
  roomId,
  isOpen,
  close,
  unmount,
  roomTitle,
  factions,
  betting,
  onSuccess,
}: BetModalControllerProps) {
  const {
    form,
    selectedFactionId,
    setSelectedFactionId,
    points,
    handlePointsChange,
    handleQuickAdd,
    resetPoints,
    minBetPoints,
    selectedSnapshot,
    otherPoolPoints,
    expectedReturn,
  } = useBetForm({ factions, betting });
  const { submitBet, isSubmitting } = useBetMutation({ roomId, onSuccess });

  const shouldUnmountRef = useRef(false);
  const lastActionRef = useRef<'none' | 'submit' | 'cancel' | 'system'>('none');

  const requestClose = (action: 'submit' | 'cancel' | 'system') => {
    lastActionRef.current = action;
    shouldUnmountRef.current = true;

    if (action !== 'submit') {
      form.reset();
    }

    close(null);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    await submitBet({ factionId: values.factionId, points: Number(values.points) });
    requestClose('submit');
  });

  const handleCancel = () => {
    requestClose('cancel');
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      shouldUnmountRef.current = false;
      return;
    }

    if (lastActionRef.current === 'none') {
      requestClose('system');
    }
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (!shouldUnmountRef.current) {
      return;
    }

    if (event.currentTarget.dataset.state !== 'closed') {
      return;
    }

    shouldUnmountRef.current = false;
    lastActionRef.current = 'none';
    unmount();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent onAnimationEnd={handleAnimationEnd} className="max-w-lg">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>배팅하기</DialogTitle>
              <DialogDescription>
                {roomTitle} · 최소 배팅 {minBetPoints.toLocaleString()} pts
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="factionId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel required className="font-semibold text-sm">
                      진영 선택
                    </FormLabel>
                    <input
                      type="hidden"
                      name={field.name}
                      value={selectedFactionId}
                      readOnly
                      ref={field.ref}
                      onBlur={field.onBlur}
                    />
                    <div className="flex flex-col gap-2">
                      {factions.map((faction) => (
                        <button
                          key={faction.id}
                          type="button"
                          onClick={() => setSelectedFactionId(faction.id)}
                          className={cn(
                            'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                            selectedFactionId === faction.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-muted/40',
                          )}
                        >
                          <div>
                            <p className="font-semibold text-sm" style={{ color: faction.color }}>
                              {faction.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {faction.memberCount}명 참여
                            </p>
                          </div>
                          <p className="font-semibold text-sm">
                            {faction.totalBetPoints.toLocaleString()} pts
                          </p>
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel required className="font-semibold text-sm">
                      배팅 포인트
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="numeric"
                        value={points}
                        onChange={(event) => handlePointsChange(event.target.value)}
                        placeholder={`${minBetPoints.toLocaleString()} pts 이상 입력`}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2">
                      {BET_QUICK_ADD_POINTS.map((quickValue) => (
                        <button
                          key={quickValue}
                          type="button"
                          className="rounded-full border border-border/70 px-3 py-1 font-semibold text-xs hover:bg-muted/40"
                          onClick={() => handleQuickAdd(quickValue)}
                        >
                          +{quickValue.toLocaleString()}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="rounded-full border border-border/70 px-3 py-1 text-muted-foreground text-xs hover:bg-muted/40"
                        onClick={resetPoints}
                      >
                        초기화
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-2xl border border-border/80 border-dashed bg-muted/40 px-4 py-3 text-sm">
                <p className="font-semibold">예상 수익</p>
                <p className="font-bold text-lg">
                  {expectedReturn > 0 ? `${Math.floor(expectedReturn).toLocaleString()} pts` : '-'}
                </p>
                <p className="text-muted-foreground text-xs">
                  내 진영 풀: {selectedSnapshot?.totalBetPoints.toLocaleString() ?? 0} pts · 상대
                  진영 풀: {otherPoolPoints.toLocaleString()} pts
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!form.formState.isValid || form.formState.isSubmitting || isSubmitting}
              >
                배팅하기
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function openBetModal(options: BetModalOptions) {
  return overlay.openAsync<null>((controllerProps) => (
    <ReactQueryProvider>
      <BetModalController {...controllerProps} {...options} />
    </ReactQueryProvider>
  ));
}

export type { BetModalOptions };
export { openBetModal };
