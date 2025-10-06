'use client';

import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { completeGoogleLogin } from '@/features/auth/session/model/session-service';
import { ROUTE_PATHS } from '@/shared/config/constants';

const LOGIN_ERROR_MESSAGES = {
  DEFAULT: '로그인에 실패했어요. 잠시 후 다시 시도해주세요.',
  CANCELLED: '로그인이 취소되었어요. 다시 진행해주세요.',
} as const;

type CompleteGoogleLoginVariables = {
  code: string;
  redirectUri?: string;
};

type CompleteGoogleLoginResult = Awaited<ReturnType<typeof completeGoogleLogin>>;

async function resolveHttpErrorMessage(error: HTTPError) {
  try {
    const body = await error.response.clone().json();

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: string }).message;
      return typeof message === 'string' ? message : null;
    }
  } catch (parseError) {
    console.error('[Google OAuth] 로그인 응답 파싱 중 오류가 발생했어요.', parseError);
  }

  return null;
}

function resolveRedirectPath(redirectUri?: string) {
  if (
    typeof redirectUri === 'string' &&
    redirectUri.startsWith('/') &&
    !redirectUri.startsWith('//')
  ) {
    return redirectUri;
  }

  return ROUTE_PATHS.HOME;
}

function useCompleteGoogleLogin() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation<CompleteGoogleLoginResult, unknown, CompleteGoogleLoginVariables>({
    mutationFn: async (variables) => {
      setErrorMessage(null);
      return completeGoogleLogin(variables);
    },
    onSuccess: (_data, variables) => {
      const destination = resolveRedirectPath(variables.redirectUri);
      router.replace(destination);
    },
    onError: async (error) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setErrorMessage(LOGIN_ERROR_MESSAGES.CANCELLED);
        return;
      }

      if (error instanceof HTTPError) {
        const resolvedMessage = await resolveHttpErrorMessage(error);
        setErrorMessage(resolvedMessage ?? LOGIN_ERROR_MESSAGES.DEFAULT);
        return;
      }

      console.error('[Google OAuth] 로그인 완료 처리 중 오류가 발생했어요.', error);
      setErrorMessage(LOGIN_ERROR_MESSAGES.DEFAULT);
    },
  });

  const completeLogin = useCallback(
    (variables: CompleteGoogleLoginVariables) => {
      mutation.mutate(variables);
    },
    [mutation],
  );

  const resetError = useCallback(() => {
    setErrorMessage(null);
    mutation.reset();
  }, [mutation]);

  return useMemo(
    () => ({
      completeLogin,
      isLoading: mutation.isPending,
      errorMessage,
      resetError,
    }),
    [completeLogin, errorMessage, mutation.isPending, resetError],
  );
}

export { useCompleteGoogleLogin };
