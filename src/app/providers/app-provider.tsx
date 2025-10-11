'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import {
  GOOGLE_CLIENT_ID,
  IS_GOOGLE_CLIENT_CONFIGURED,
} from '@/features/auth/google/config/google-oauth-config';
import { runtimeEnv } from '@/shared/config/env';
import { logDebug } from '@/shared/lib/logger';
import { ReactQueryProvider } from '@/shared/providers/react-query-provider';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { Toaster } from '@/shared/ui/sonner';

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (!runtimeEnv.isApiMockingEnabled) {
      return;
    }

    let isUnmounted = false;

    const enableMocks = async () => {
      try {
        const { enableMocking } = await import('@/shared/mocks');

        if (!isUnmounted) {
          await enableMocking();
        }
      } catch (error) {
        console.error('[AppProvider] MSW 초기화에 실패했습니다.', error);
      }
    };

    enableMocks();

    return () => {
      isUnmounted = true;
    };
  }, []);

  const content = (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );

  if (!IS_GOOGLE_CLIENT_CONFIGURED) {
    logDebug('GoogleOAuthProvider', 'client id가 없어 로그인 기능이 비활성화됩니다.');

    return content;
  }

  return (
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => {
        logDebug('GoogleOAuthProvider', 'Google Identity Services 스크립트 로드에 실패했어요.');
      }}
    >
      {content}
    </GoogleOAuthProvider>
  );
}
