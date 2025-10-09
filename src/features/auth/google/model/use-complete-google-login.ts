'use client';

import { useMutation } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { resolveHttpErrorMessage } from '@/features/auth/google/lib/resolve-http-error-message';
import { resolveRedirectPath } from '@/features/auth/google/lib/resolve-redirect-path';
import { completeGoogleLogin } from '@/features/auth/session/model/session-service';
import { logDebug } from '@/shared/lib/logger';

const LOGIN_ERROR_MESSAGES = {
  DEFAULT: '로그인에 실패했어요. 잠시 후 다시 시도해주세요.',
  CANCELLED: '로그인이 취소되었어요. 다시 진행해주세요.',
} as const;

type CompleteGoogleLoginVariables = {
  code: string;
  redirectUri?: string;
};

type CompleteGoogleLoginResult = Awaited<ReturnType<typeof completeGoogleLogin>>;

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
        logDebug('GoogleOAuth', '로그인이 AbortError로 취소되었어요.', error);
        setErrorMessage(LOGIN_ERROR_MESSAGES.CANCELLED);
        return;
      }

      if (error instanceof HTTPError) {
        const resolvedMessage = await resolveHttpErrorMessage(error);
        logDebug('GoogleOAuth', 'HTTP 오류 응답을 수신했어요.', error);
        setErrorMessage(resolvedMessage ?? LOGIN_ERROR_MESSAGES.DEFAULT);
        return;
      }

      logDebug('GoogleOAuth', '로그인 완료 처리 중 예기치 못한 오류가 발생했어요.', error);
      setErrorMessage(LOGIN_ERROR_MESSAGES.DEFAULT);
    },
  });

  function completeLogin(variables: CompleteGoogleLoginVariables) {
    mutation.mutate(variables);
  }

  function resetError() {
    setErrorMessage(null);
    mutation.reset();
  }

  return {
    completeLogin,
    isLoading: mutation.isPending,
    errorMessage,
    resetError,
  };
}

export { useCompleteGoogleLogin };
