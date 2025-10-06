'use client';

import { type CodeResponse, type NonOAuthError, useGoogleLogin } from '@react-oauth/google';
import { useCallback, useMemo, useState } from 'react';

import {
  GOOGLE_OAUTH_ERROR_MESSAGES,
  IS_GOOGLE_CLIENT_CONFIGURED,
} from '@/features/auth/google/config/google-oauth-config';

interface UseGoogleOAuthOptions {
  onSuccess?: (codeResponse: CodeResponse) => void;
}

interface UseGoogleOAuthReturn {
  signIn: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  resetError: () => void;
}

const NON_OAUTH_ERROR_COPY = {
  popup_failed_to_open: GOOGLE_OAUTH_ERROR_MESSAGES.POPUP_BLOCKED,
  popup_closed: GOOGLE_OAUTH_ERROR_MESSAGES.POPUP_CLOSED,
  unknown: GOOGLE_OAUTH_ERROR_MESSAGES.DEFAULT,
} as const satisfies Record<NonOAuthError['type'], string>;

function useGoogleOAuth(options: UseGoogleOAuthOptions = {}): UseGoogleOAuthReturn {
  const [errorMessage, setErrorMessage] = useState<string | null>(
    IS_GOOGLE_CLIENT_CONFIGURED ? null : GOOGLE_OAUTH_ERROR_MESSAGES.CLIENT_ID_MISSING,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = useCallback(
    (codeResponse: CodeResponse) => {
      setIsLoading(false);
      setErrorMessage(null);
      console.info('[Google OAuth] Authorization code 수신', {
        scope: codeResponse.scope,
        code: codeResponse.code,
      });
      options.onSuccess?.(codeResponse);
    },
    [options],
  );

  const handleFailure = useCallback((message?: string) => {
    setIsLoading(false);
    setErrorMessage(message ?? GOOGLE_OAUTH_ERROR_MESSAGES.DEFAULT);
  }, []);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: handleSuccess,
    onError: (errorResponse) => {
      handleFailure(errorResponse.error_description);
    },
    onNonOAuthError: (nonOAuthError) => {
      const fallbackMessage =
        NON_OAUTH_ERROR_COPY[nonOAuthError.type] ?? GOOGLE_OAUTH_ERROR_MESSAGES.DEFAULT;
      handleFailure(fallbackMessage);
    },
  });

  const signIn = useCallback(() => {
    if (!IS_GOOGLE_CLIENT_CONFIGURED) {
      setErrorMessage(GOOGLE_OAUTH_ERROR_MESSAGES.CLIENT_ID_MISSING);
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      login();
    } catch (error) {
      console.error('[Google OAuth] 로그인 요청 중 예기치 못한 오류가 발생했어요.', error);
      handleFailure();
    }
  }, [handleFailure, login]);

  const resetError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return useMemo(
    () => ({
      signIn,
      isLoading,
      errorMessage,
      resetError,
    }),
    [errorMessage, isLoading, resetError, signIn],
  );
}

export { useGoogleOAuth };
