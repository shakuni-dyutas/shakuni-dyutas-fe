import { z } from 'zod';

const betFormBaseSchema = z.object({
  factionId: z.string().min(1, '배팅할 진영을 선택해 주세요.'),
  points: z
    .string()
    .min(1, '배팅 포인트를 입력해 주세요.')
    .regex(/^[0-9]+$/, '배팅 포인트를 입력해 주세요.')
    .refine((value) => Number(value) > 0, '배팅 포인트를 입력해 주세요.'),
});

type BetFormValues = z.infer<typeof betFormBaseSchema>;

function createBetFormSchema(minBetPoints: number) {
  return betFormBaseSchema.refine((values) => Number(values.points) >= minBetPoints, {
    message: `최소 배팅 포인트는 ${minBetPoints.toLocaleString()} pts 입니다.`,
    path: ['points'],
  });
}

export { createBetFormSchema };
export type { BetFormValues };
