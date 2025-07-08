/**
 * 기본 에러 타입
 */
export interface BaseError {
  id: string;
  message: string;
  timestamp: Date;
  stack?: string;
}

/**
 * API 에러 타입
 */
export interface ApiError extends BaseError {
  type: 'API_ERROR';
  status: number;
  endpoint: string;
  method: string;
}

/**
 * 네트워크 에러 타입
 */
export interface NetworkError extends BaseError {
  type: 'NETWORK_ERROR';
  isOffline: boolean;
}

/**
 * 컴포넌트 에러 타입
 */
export interface ComponentError extends BaseError {
  type: 'COMPONENT_ERROR';
  componentName: string;
  props?: Record<string, unknown>;
}

/**
 * 전체 에러 유니온 타입
 */
export type AppError = ApiError | NetworkError | ComponentError;
