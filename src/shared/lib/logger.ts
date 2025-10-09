/**
 * 개발 환경에서만 디버그 로그를 출력하는 유틸리티
 */

const isDebugEnabled = process.env.NODE_ENV !== 'production';

function logDebug(scope: string, message: string, ...details: unknown[]) {
  if (!isDebugEnabled) {
    return;
  }

  const tag = scope ? `[DEBUG][${scope}]` : '[DEBUG]';
  const formattedMessage = `${tag} ${message}`;

  if (details.length > 0) {
    console.info(formattedMessage, ...details);
    return;
  }

  console.info(formattedMessage);
}

export { logDebug };
