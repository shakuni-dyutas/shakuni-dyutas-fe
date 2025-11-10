import { z } from 'zod';

interface EvidenceRestrictions {
  textMaxLength: number;
  imageMaxSizeMb: number;
  imageMaxCount: number;
}

const imageFileSchema = z.custom<File>((file) => file instanceof File, {
  message: '이미지 파일만 업로드할 수 있어요.',
});

function createEvidenceFormSchema(restrictions: EvidenceRestrictions) {
  const { textMaxLength, imageMaxSizeMb, imageMaxCount } = restrictions;
  const summaryMaxLength = Math.min(120, textMaxLength);

  return z.object({
    summary: z
      .string()
      .trim()
      .min(1, '증거 제목을 입력해 주세요.')
      .max(summaryMaxLength, `증거 제목은 최대 ${summaryMaxLength}자까지 입력할 수 있어요.`),
    body: z
      .string()
      .trim()
      .min(1, '증거 내용을 입력해 주세요.')
      .max(textMaxLength, `증거 내용은 최대 ${textMaxLength}자까지 입력할 수 있어요.`),
    images: z
      .array(imageFileSchema)
      .max(imageMaxCount, `이미지는 최대 ${imageMaxCount}개까지 업로드할 수 있어요.`)
      .refine(
        (files) => files.every((file) => file.size <= imageMaxSizeMb * 1024 * 1024),
        `각 이미지는 ${imageMaxSizeMb}MB 이하여야 해요.`,
      ),
  });
}

type EvidenceFormValues = z.infer<ReturnType<typeof createEvidenceFormSchema>>;

export type { EvidenceRestrictions, EvidenceFormValues };
export { createEvidenceFormSchema };
