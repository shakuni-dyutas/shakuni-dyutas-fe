'use client';

import Image from 'next/image';
import { overlay } from 'overlay-kit';
import { type AnimationEvent, type ChangeEvent, useEffect, useRef, useState } from 'react';

import type { RoomRestrictionConfig } from '@/entities/room/types/room-detail';
import type { TeamFactionId } from '@/entities/team/types/team-faction';
import { useEvidenceForm } from '@/features/evidence-submit/model/use-evidence-form';
import { formatFileSize } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
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

interface EvidenceModalOptions {
  roomTitle: string;
  faction: {
    id: TeamFactionId;
    name: string;
  } | null;
  restrictions: RoomRestrictionConfig['evidence'];
  hasSubmitted: boolean;
  onSubmit: (values: EvidenceSubmitPayload) => Promise<void> | void;
}

interface EvidenceSubmitPayload {
  factionId: TeamFactionId;
  summary: string;
  body: string;
  images: File[];
}

interface EvidenceModalControllerProps extends EvidenceModalOptions {
  overlayId: string;
  isOpen: boolean;
  close: (result: null) => void;
  unmount: () => void;
}

function EvidenceModalController({
  isOpen,
  close,
  unmount,
  roomTitle,
  faction,
  restrictions,
  hasSubmitted,
  onSubmit,
}: EvidenceModalControllerProps) {
  const { form, appendFiles, removeImage, resetForm } = useEvidenceForm({ restrictions });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shouldUnmountRef = useRef(false);
  const lastActionRef = useRef<'none' | 'submit' | 'cancel'>('none');

  const isSubmissionLocked = hasSubmitted || !faction;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!faction) {
      return;
    }

    await onSubmit({
      factionId: faction.id,
      summary: values.summary,
      body: values.body,
      images: values.images,
    });

    resetForm();
    requestClose('submit');
  });

  const requestClose = (action: 'submit' | 'cancel') => {
    lastActionRef.current = action;
    shouldUnmountRef.current = true;

    if (action === 'cancel') {
      resetForm();
    }

    close(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      shouldUnmountRef.current = false;
      return;
    }

    if (lastActionRef.current === 'none') {
      resetForm();
      shouldUnmountRef.current = true;
      close(null);
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

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    appendFiles(event.target.files);
    event.target.value = '';
  };

  const summaryText = `텍스트 ${restrictions.textMaxLength}자 · 이미지 ${restrictions.imageMaxCount}장 (${restrictions.imageMaxSizeMb}MB 이하)`;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent onAnimationEnd={handleAnimationEnd} className="max-w-2xl">
        <Form {...form}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>증거 제출</DialogTitle>
              <DialogDescription>
                {roomTitle} · {faction ? `${faction.name} 진영` : '참가 진영 미선택'}
              </DialogDescription>
            </DialogHeader>

            {!faction ? (
              <p className="rounded-xl border border-border/80 border-dashed bg-muted/50 px-4 py-3 text-muted-foreground text-sm">
                증거 제출은 진영을 선택한 후에만 진행할 수 있어요. 방 참가 정보를 확인해 주세요.
              </p>
            ) : null}

            {hasSubmitted ? (
              <p className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-primary text-sm">
                이미 증거를 제출했어요. 한 번 제출한 이후에는 수정이 제한됩니다.
              </p>
            ) : null}

            <fieldset className="space-y-5" disabled={isSubmissionLocked}>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel required>증거 제목</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="증거를 한 줄로 요약해 주세요." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel required>증거 내용</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} placeholder="상세한 내용을 작성해 주세요." />
                    </FormControl>
                    <FormDescription>{summaryText}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => {
                  const files = field.value ?? [];

                  return (
                    <FormItem className="space-y-3">
                      <FormLabel>이미지 첨부 (선택)</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleFilesChange}
                          />
                          <Button type="button" variant="outline" onClick={handleFileSelect}>
                            이미지 선택
                          </Button>
                          {files.length > 0 ? (
                            <EvidenceImageList files={files} onRemove={removeImage} />
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              이미지를 선택해 첨부해 주세요.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        각 이미지는 {restrictions.imageMaxSizeMb}MB 이하여야 하며 최대{' '}
                        {restrictions.imageMaxCount}장까지 등록할 수 있어요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </fieldset>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => requestClose('cancel')}>
                닫기
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmissionLocked || !form.formState.isValid || form.formState.isSubmitting
                }
              >
                제출하기
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function openEvidenceModal(options: EvidenceModalOptions) {
  return overlay.openAsync<null>((controllerProps) => (
    <EvidenceModalController {...controllerProps} {...options} />
  ));
}

function EvidenceImageList({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (index: number) => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  return (
    <ul className="space-y-2 text-sm">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${index}`}
          className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-2"
        >
          <div className="flex items-center gap-3">
            {previews[index] ? (
              <span className="flex h-12 w-12 overflow-hidden rounded-lg border border-border/60 bg-muted">
                <Image
                  src={previews[index]}
                  alt={`${file.name} 미리보기`}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </span>
            ) : null}
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button type="button" size="sm" variant="ghost" onClick={() => onRemove(index)}>
            삭제
          </Button>
        </li>
      ))}
    </ul>
  );
}

export type { EvidenceModalOptions, EvidenceSubmitPayload };
export { openEvidenceModal };
