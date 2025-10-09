'use client';

import { type CodeResponse, type NonOAuthError, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

import {
  GOOGLE_OAUTH_ERROR_MESSAGES,
  IS_GOOGLE_CLIENT_CONFIGURED,
} from '@/features/auth/google/config/google-oauth-config';
import { logDebug } from '@/shared/lib/logger';

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

  const handleSuccess = (codeResponse: CodeResponse) => {
    setIsLoading(false);
    setErrorMessage(null);

    const maskedCode =
      typeof codeResponse.code === 'string'
        ? `${'*'.repeat(Math.max(codeResponse.code.length - 4, 0))}${codeResponse.code.slice(-4)}`
        : undefined;

    logDebug('GoogleOAuth', 'Authorization code 수신', {
      scope: codeResponse.scope,
      maskedCode: maskedCode ?? 'N/A',
    });
    options.onSuccess?.(codeResponse);
  };

  const handleFailure = (message?: string) => {
    setIsLoading(false);
    setErrorMessage(message ?? GOOGLE_OAUTH_ERROR_MESSAGES.DEFAULT);
  };

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: handleSuccess,
    onError: (errorResponse) => {
      logDebug('GoogleOAuth', 'OAuth 오류 응답을 수신했어요.', errorResponse);
      handleFailure(errorResponse.error_description);
    },
    onNonOAuthError: (nonOAuthError) => {
      const fallbackMessage =
        NON_OAUTH_ERROR_COPY[nonOAuthError.type] ?? GOOGLE_OAUTH_ERROR_MESSAGES.DEFAULT;
      logDebug('GoogleOAuth', 'OAuth 외 오류가 발생했어요.', nonOAuthError);
      handleFailure(fallbackMessage);
    },
  });

  const signIn = () => {
    if (!IS_GOOGLE_CLIENT_CONFIGURED) {
      setErrorMessage(GOOGLE_OAUTH_ERROR_MESSAGES.CLIENT_ID_MISSING);
      logDebug('GoogleOAuth', 'client id가 없어 로그인 요청을 중단했어요.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      login();
    } catch (error) {
      logDebug('GoogleOAuth', '로그인 요청 중 예기치 못한 오류가 발생했어요.', error);
      handleFailure();
    }
  };

  const resetError = () => {
    setErrorMessage(null);
  };

  return {
    signIn,
    isLoading,
    errorMessage,
    resetError,
  };
}

export { useGoogleOAuth };
