import { z } from 'zod';

const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_API_URL: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();

    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().url().optional()),
  NEXT_PUBLIC_API_MOCKING: z.enum(['enabled', 'disabled']).default('disabled'),
});

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING ?? 'disabled',
};

const parsedEnv = clientEnvSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  const fieldErrors = parsedEnv.error.flatten().fieldErrors;
  console.error('[runtimeEnv] 환경변수 스키마 검증에 실패했어요.', fieldErrors);

  if (rawEnv.NODE_ENV === 'production') {
    throw new Error('환경변수 구성이 올바르지 않습니다. 자세한 내용은 로그를 확인하세요.');
  }

  const serializedErrors = JSON.stringify(fieldErrors);
  throw new Error(`환경변수 구성이 올바르지 않습니다: ${serializedErrors}`);
}

const runtimeEnv = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  apiBaseUrl: parsedEnv.data.NEXT_PUBLIC_API_URL ?? '/api',
  isApiMockingEnabled: parsedEnv.data.NEXT_PUBLIC_API_MOCKING === 'enabled',
} as const;

export type RuntimeEnv = typeof runtimeEnv;
export { runtimeEnv };
