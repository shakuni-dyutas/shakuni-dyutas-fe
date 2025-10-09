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

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (!runtimeEnv.isApiMockingEnabled) {
      return;
    }

    void import('@/shared/mocks').then(({ enableMocking }) => enableMocking());
  }, []);

  const fallbackClientId = GOOGLE_CLIENT_ID || 'missing-google-client-id';

  return (
    <GoogleOAuthProvider
      clientId={fallbackClientId}
      onScriptLoadError={() => {
        logDebug('GoogleOAuthProvider', 'Google Identity Services 스크립트 로드에 실패했어요.');
      }}
      onScriptLoadSuccess={() => {
        if (!IS_GOOGLE_CLIENT_CONFIGURED) {
          logDebug('GoogleOAuthProvider', 'client id가 없어 로그인 기능이 비활성화됩니다.');
        }
      }}
    >
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </GoogleOAuthProvider>
  );
}
