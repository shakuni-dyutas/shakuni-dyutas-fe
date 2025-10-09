/**
 * Google OAuth 관련 환경설정 및 공용 문구
 */

import { logDebug } from '@/shared/lib/logger';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const IS_GOOGLE_CLIENT_CONFIGURED = Boolean(GOOGLE_CLIENT_ID);

if (!IS_GOOGLE_CLIENT_CONFIGURED) {
  logDebug('GoogleOAuthConfig', 'NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
}

const GOOGLE_OAUTH_ERROR_MESSAGES = {
  CLIENT_ID_MISSING:
    'Google OAuth 설정이 완료되지 않았어요. 담당자에게 환경변수 설정을 요청해주세요.',
  POPUP_BLOCKED: '브라우저에서 팝업이 차단되었어요. 팝업을 허용한 뒤 다시 시도해주세요.',
  POPUP_CLOSED: '로그인 창이 닫혔어요. 다시 시도해주세요.',
  DEFAULT: 'Google 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
} as const;

export { GOOGLE_CLIENT_ID, GOOGLE_OAUTH_ERROR_MESSAGES, IS_GOOGLE_CLIENT_CONFIGURED };
