'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import {
  GOOGLE_CLIENT_ID,
  IS_GOOGLE_CLIENT_CONFIGURED,
} from '@/features/auth/google/config/google-oauth-config';
import { runtimeEnv } from '@/shared/config/env';

import { ReactQueryProvider } from './react-query-provider';

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
        console.error('[Google OAuth] Google Identity Services 스크립트를 불러오지 못했어요.');
      }}
      onScriptLoadSuccess={() => {
        if (!IS_GOOGLE_CLIENT_CONFIGURED) {
          console.warn('[Google OAuth] client id가 없어 로그인 기능이 비활성화됩니다.');
        }
      }}
    >
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </GoogleOAuthProvider>
  );
}
