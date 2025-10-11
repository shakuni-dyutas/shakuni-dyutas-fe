'use client';

import { overlay } from 'overlay-kit';
import { type AnimationEvent, useEffect, useRef } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

type ConfirmDialogTone = 'default' | 'destructive';

interface ConfirmDialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
}

interface ConfirmDialogControllerProps extends ConfirmDialogOptions {
  overlayId: string;
  isOpen: boolean;
  close: (result: boolean) => void;
  unmount: () => void;
}

function ConfirmDialog({
  isOpen,
  close,
  unmount,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  tone = 'default',
}: ConfirmDialogControllerProps) {
  const lastActionRef = useRef<'none' | 'confirm' | 'cancel'>('none');
  const shouldUnmountRef = useRef(false);

  useEffect(() => {
    return () => {
      shouldUnmountRef.current = false;
      lastActionRef.current = 'none';
    };
  }, []);

  const requestClose = (result: boolean) => {
    shouldUnmountRef.current = true;
    close(result);
  };

  const handleConfirm = () => {
    lastActionRef.current = 'confirm';
    requestClose(true);
  };

  const handleCancel = () => {
    lastActionRef.current = 'cancel';
    requestClose(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      shouldUnmountRef.current = false;
      return;
    }

    if (lastActionRef.current === 'none') {
      requestClose(false);
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

  const confirmClassName =
    tone === 'destructive'
      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      : 'bg-primary text-primary-foreground hover:bg-primary/90';

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent onAnimationEnd={handleAnimationEnd}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className={confirmClassName}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function openConfirmDialog(options: ConfirmDialogOptions) {
  return overlay.openAsync<boolean>((controllerProps) => (
    <ConfirmDialog {...controllerProps} {...options} />
  ));
}

export type { ConfirmDialogOptions };
export { ConfirmDialog, openConfirmDialog };
