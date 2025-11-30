'use client';

import { Loader2, Plus, Trash2 } from 'lucide-react';
import { CREATE_ROOM_MAX_FACTION_COUNT } from '@/features/rooms/create/model/create-room-form-schema';
import { useCreateRoomForm } from '@/features/rooms/create/model/use-create-room-form';
import { useCreateRoomMutation } from '@/features/rooms/create/model/use-create-room-mutation';
import { logDebug } from '@/shared/lib/logger';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { openConfirmDialog } from '@/shared/ui/confirm-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

function CreateRoomPanel() {
  const { form, factionFields, appendFaction, removeFaction, canAppendFaction, resetForm } =
    useCreateRoomForm();
  const { createRoom, isCreatingRoom } = useCreateRoomMutation();
  const isSubmitting = form.formState.isSubmitting || isCreatingRoom;
  const isFormValid = form.formState.isValid;
  const isSubmitDisabled = isSubmitting || !isFormValid;

  const factionListErrorMessage =
    form.formState.errors.factions?.root?.message ??
    form.formState.errors.factions?.message ??
    null;

  const handleSubmit = form.handleSubmit(async (values) => {
    const isConfirmed = await openConfirmDialog({
      title: '방을 생성할까요?',
      description: '입력한 정보로 새 방을 만듭니다.',
      confirmLabel: '생성하기',
      cancelLabel: '취소',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      await createRoom(values);
    } catch (error) {
      logDebug('CreateRoom', '방 생성 제출 중 오류가 발생했어요.', error);
    }
  });

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="font-semibold text-2xl">새 방 생성</h1>
        <p className="text-muted-foreground text-sm">
          게임을 시작하기 전에 방 정보를 설정하고 친구들에게 초대 링크를 공유하세요.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-8 p-6 md:p-8">
          <Form {...form}>
            <form
              className="space-y-10"
              data-testid="create-room-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <section className="space-y-4">
                <div className="space-y-2">
                  <h2 className="font-semibold text-lg">기본 정보</h2>
                  <p className="text-muted-foreground text-sm">
                    방의 제목과 설명, 제한 시간을 설정해 주세요.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>방 제목</FormLabel>
                      <FormControl>
                        <Input placeholder="예) 전설의 도박장" {...field} />
                      </FormControl>
                      <FormDescription>참여자에게 노출되는 방의 대표 이름입니다.</FormDescription>
                      {fieldState.error ? (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      ) : null}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>방 설명</FormLabel>
                      <FormControl>
                        <Textarea placeholder="방에 대한 설명을 입력해 주세요." {...field} />
                      </FormControl>
                      <FormDescription>
                        게임 목표, 참여 규칙 등 추가 정보를 안내할 수 있습니다.
                      </FormDescription>
                      {fieldState.error ? (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      ) : null}
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="timeLimitMinutes"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>제한 시간(분)</FormLabel>
                        <FormControl>
                          <Input type="text" inputMode="numeric" placeholder="예) 30" {...field} />
                        </FormControl>
                        <FormDescription>
                          한 라운드 또는 게임 진행 시간을 분 단위로 설정합니다.
                        </FormDescription>
                        {fieldState.error ? (
                          <FormMessage>{fieldState.error.message}</FormMessage>
                        ) : null}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minBetPoint"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel required>최소 배팅 포인트</FormLabel>
                        <FormControl>
                          <Input type="text" inputMode="numeric" placeholder="예) 100" {...field} />
                        </FormControl>
                        <FormDescription>
                          참여자가 최소로 배팅해야 하는 포인트를 설정합니다.
                        </FormDescription>
                        {fieldState.error ? (
                          <FormMessage>{fieldState.error.message}</FormMessage>
                        ) : null}
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <h2 className="font-semibold text-lg">진영 구성</h2>
                    <p className="text-muted-foreground text-sm">
                      게임에 참여할 진영의 이름과 설명을 입력하세요.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={appendFaction}
                    disabled={!canAppendFaction}
                    aria-disabled={!canAppendFaction}
                  >
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> 진영 추가
                  </Button>
                </div>

                <div className="grid gap-4">
                  {factionFields.map((field, index) => (
                    <Card key={field.id} className="border-border border-dashed">
                      <CardContent className="space-y-4 p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-medium text-muted-foreground text-sm">
                            진영 #{index + 1}
                          </span>
                          {factionFields.length > 1 ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFaction(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" /> 제거
                            </Button>
                          ) : null}
                        </div>

                        <FormField
                          control={form.control}
                          name={`factions.${index}.title` as const}
                          render={({ field: factionField, fieldState }) => (
                            <FormItem>
                              <FormLabel required>진영 이름</FormLabel>
                              <FormControl>
                                <Input placeholder="예) 사신단" {...factionField} />
                              </FormControl>
                              {fieldState.error ? (
                                <FormMessage>{fieldState.error.message}</FormMessage>
                              ) : null}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`factions.${index}.description` as const}
                          render={({ field: factionField, fieldState }) => (
                            <FormItem>
                              <FormLabel required>진영 설명</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="진영에 대한 역할이나 특징을 입력하세요."
                                  {...factionField}
                                />
                              </FormControl>
                              {fieldState.error ? (
                                <FormMessage>{fieldState.error.message}</FormMessage>
                              ) : null}
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <p className="text-muted-foreground text-xs">
                  진영은 최대 {CREATE_ROOM_MAX_FACTION_COUNT}개까지 추가할 수 있습니다.
                </p>

                {factionListErrorMessage ? (
                  <p className="text-destructive text-sm">{factionListErrorMessage}</p>
                ) : null}
              </section>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  초기화
                </Button>
                <Button
                  type="submit"
                  className="min-w-[120px] gap-2"
                  disabled={isSubmitDisabled}
                  aria-busy={isSubmitting}
                  aria-disabled={isSubmitDisabled}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                      <span aria-live="polite">방 생성 중…</span>
                    </>
                  ) : (
                    <span>방 생성</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

export { CreateRoomPanel };
