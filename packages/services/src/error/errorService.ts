import { AppError, ApiError, NetworkError, ComponentError } from './type';

/**
 * 에러 ID 생성기
 */
const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 기본 에러 속성 생성
 */
const createBaseError = (message: string, stack?: string) => ({
  id: generateErrorId(),
  message,
  timestamp: new Date(),
  stack,
});

/**
 * API 에러 생성
 */
export const createApiError = (
  message: string,
  status: number,
  endpoint: string,
  method: string,
  stack?: string,
): ApiError => ({
  ...createBaseError(message, stack),
  type: 'API_ERROR',
  status,
  endpoint,
  method,
});

/**
 * 네트워크 에러 생성
 */
export const createNetworkError = (
  message: string,
  isOffline: boolean,
  stack?: string,
): NetworkError => ({
  ...createBaseError(message, stack),
  type: 'NETWORK_ERROR',
  isOffline,
});

/**
 * 컴포넌트 에러 생성
 */
export const createComponentError = (
  message: string,
  componentName: string,
  props?: Record<string, unknown>,
  stack?: string,
): ComponentError => ({
  ...createBaseError(message, stack),
  type: 'COMPONENT_ERROR',
  componentName,
  props,
});

/**
 * 일반 Error를 AppError로 변환
 */
export const mtrGlobalError = (
  error: Error,
  type: AppError['type'] = 'COMPONENT_ERROR',
): AppError => {
  const baseError = createBaseError(error.message, error.stack);

  switch (type) {
    case 'API_ERROR':
      return {
        ...baseError,
        type: 'API_ERROR',
        status: 500,
        endpoint: 'unknown',
        method: 'unknown',
      };
    case 'NETWORK_ERROR':
      return {
        ...baseError,
        type: 'NETWORK_ERROR',
        isOffline: !navigator.onLine,
      };
    case 'COMPONENT_ERROR':
    default:
      return {
        ...baseError,
        type: 'COMPONENT_ERROR',
        componentName: 'unknown',
      };
  }
};
