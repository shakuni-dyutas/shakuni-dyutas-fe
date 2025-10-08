/**
 * 전역 공용 상수 정의
 * 매직 넘버/리터럴 금지 규칙에 따라 의미 있는 상수로 분리
 */

// API 관련 상수
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
} as const;

// 라우트 경로 상수
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
} as const;

// UI 관련 상수
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// 페이지네이션 관련 상수
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// 검증 관련 상수
export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 2,
  MAX_USERNAME_LENGTH: 50,
} as const;
