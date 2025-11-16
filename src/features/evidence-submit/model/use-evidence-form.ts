import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { type UseFormReturn, useForm } from 'react-hook-form';

import { ROOM_EVIDENCE_CONSTRAINTS } from '@/entities/room/config/constants';
import {
  createEvidenceFormSchema,
  type EvidenceFormValues,
  type EvidenceRestrictions,
} from '@/features/evidence-submit/model/evidence-form-schema';

interface UseEvidenceFormParams {
  restrictions?: EvidenceRestrictions;
}

interface UseEvidenceFormResult {
  form: UseFormReturn<EvidenceFormValues>;
  appendFiles: (files: FileList | File[] | null) => void;
  removeImage: (index: number) => void;
  resetForm: () => void;
}

const DEFAULT_RESTRICTIONS: EvidenceRestrictions = {
  textMaxLength: ROOM_EVIDENCE_CONSTRAINTS.textMaxLength,
  imageMaxSizeMb: ROOM_EVIDENCE_CONSTRAINTS.imageMaxSizeMb,
  imageMaxCount: ROOM_EVIDENCE_CONSTRAINTS.imageMaxCount,
} as const;

function useEvidenceForm({
  restrictions = DEFAULT_RESTRICTIONS,
}: UseEvidenceFormParams = {}): UseEvidenceFormResult {
  const schema = useMemo(() => createEvidenceFormSchema(restrictions), [restrictions]);

  const form = useForm<EvidenceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      summary: '',
      body: '',
      images: [],
    },
    mode: 'onChange',
  });

  const appendFiles = (files: FileList | File[] | null) => {
    if (!files) {
      return;
    }

    const nextFiles = Array.isArray(files) ? files : Array.from(files);
    const merged = [...form.getValues('images'), ...nextFiles];
    form.setValue('images', merged, { shouldDirty: true, shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const current = form.getValues('images');
    const next = current.filter((_, idx) => idx !== index);
    form.setValue('images', next, { shouldDirty: true, shouldValidate: true });
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    appendFiles,
    removeImage,
    resetForm,
  };
}

export type { UseEvidenceFormParams, UseEvidenceFormResult };
export { useEvidenceForm };
