'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import {
  GOOGLE_CLIENT_ID,
  IS_GOOGLE_CLIENT_CONFIGURED,
} from '@/features/auth/google/config/google-oauth-config';
import { ensureSessionWithRefreshToken } from '@/features/auth/session/model/session-service';
import { runtimeEnv } from '@/shared/config/env';
import { logDebug } from '@/shared/lib/logger';
import { OverlayRootProvider } from '@/shared/providers/overlay-provider';
import { ReactQueryProvider } from '@/shared/providers/react-query-provider';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { Toaster } from '@/shared/ui/sonner';

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    let isUnmounted = false;

    const bootstrap = async () => {
      let mockingFailed = false;

      if (runtimeEnv.isApiMockingEnabled) {
        try {
          const { enableMocking } = await import('@/shared/mocks');

          if (!isUnmounted) {
            await enableMocking();
          }
        } catch (error) {
          mockingFailed = true;
          console.error('[AppProvider] MSW 초기화에 실패했습니다. 실제 API를 사용합니다.', error);
        }
      }

      if (!isUnmounted) {
        try {
          await ensureSessionWithRefreshToken();
        } catch (error) {
          console.error('[AppProvider] 세션 부트스트랩 중 오류가 발생했습니다.', error);
        }
      }

      if (mockingFailed) {
        logDebug(
          'MSW',
          'MSW 워커 초기화에 실패해서 실 API로 대체했어요. 인증서 구성을 확인해주세요.',
        );
      }
    };

    bootstrap();

    return () => {
      isUnmounted = true;
    };
  }, []);

  const content = (
    <OverlayRootProvider>
      <ThemeProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </OverlayRootProvider>
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
