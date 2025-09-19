/**
 * 공통 타입 정의
 * interface 기본 사용, 유니온/판별식/유틸리티 조합이 핵심일 때만 type 사용
 */

// 기본 응답 인터페이스
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 인터페이스
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 공통 엔티티 인터페이스
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 로딩 상태 타입 (유니온 타입이므로 type 사용)
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 정렬 방향 타입
export type SortDirection = 'asc' | 'desc';

// 정렬 옵션 인터페이스
export interface SortOption {
  field: string;
  direction: SortDirection;
}

// 필터 옵션 인터페이스
export interface FilterOption {
  field: string;
  value: string | number | boolean;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
}
