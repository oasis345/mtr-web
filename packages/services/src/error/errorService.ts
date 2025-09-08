import {
  BaseError,
  NetworkError,
  ApiError,
  UnknownError,
  isError,
  isBaseError,
  type ErrorEnvironment,
} from './baseError';

// 특정 에러 핸들러 로직은 외부(apps/web)에서 주입받는다.
export type ErrorHandler = {
  canHandle: (error: unknown) => boolean;
  handle: (error: unknown) => BaseError;
};

/**
 * Next.js 환경별 기본 에러 핸들러들
 */
export const createDefaultHandlers = (environment: ErrorEnvironment): ErrorHandler[] => [
  // Fetch API 에러 처리
  {
    canHandle: (error): error is TypeError =>
      error instanceof TypeError && error.message.includes('fetch'),
    handle: error =>
      new NetworkError('서버와의 연결에 실패했습니다.', {
        cause: error as Error,
        context: { environment },
      }),
  },

  // AbortError 처리 (fetch 취소)
  {
    canHandle: (error): error is Error => isError(error) && error.name === 'AbortError',
    handle: error =>
      new BaseError('요청이 취소되었습니다.', {
        cause: error,
        code: 'REQUEST_ABORTED',
        context: { environment },
      }),
  },

  // Response 에러 처리 (HTTP 상태 코드 기반)
  {
    canHandle: (error): error is Response => error instanceof Response && !error.ok,
    handle: error => {
      const message = `서버 요청 실패: ${error.status} ${error.statusText}`;
      return new ApiError(message, {
        status: error.status,
        context: {
          url: error.url,
          environment,
        },
      });
    },
  },

  // 이미 BaseError인 경우
  {
    canHandle: (error): error is BaseError => isBaseError(error),
    handle: error => error as BaseError,
  },

  // 일반 Error 처리
  {
    canHandle: (error): error is Error => isError(error),
    handle: error => new UnknownError(error.message, { cause: error, context: { environment } }),
  },
];

/**
 * 순수하게 에러를 정규화만 해주는 헬퍼 함수
 */
export const normalizeError = (error: unknown, handlers: ErrorHandler[] = []): BaseError => {
  // 사용자 정의 핸들러 먼저 시도
  const customHandler = handlers.find(h => h.canHandle(error));
  if (customHandler) {
    return customHandler.handle(error);
  }

  // 기본 핸들러 시도
  const environment: ErrorEnvironment = typeof window !== 'undefined' ? 'client' : 'server';
  const defaultHandlers = createDefaultHandlers(environment);
  const defaultHandler = defaultHandlers.find(h => h.canHandle(error));

  if (defaultHandler) {
    return defaultHandler.handle(error);
  }

  // 마지막 수단: 문자열이나 기타 값 처리
  const message = typeof error === 'string' ? error : '알 수 없는 오류가 발생했습니다.';

  return new UnknownError(message, {
    context: {
      originalError: error,
      environment,
    },
  });
};

/**
 * 에러 서비스 타입 정의
 */
export type ErrorService = {
  normalize: (error: unknown) => BaseError;
  notify?: (error: BaseError) => void;
  log?: (error: BaseError) => void;
};

/**
 * 개발 환경에서 에러 로깅
 */
export const logError = (error: BaseError): void => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${error.name}`);
    console.error('Message:', error.getSafeMessage());
    console.error('Code:', error.code);
    console.error('Status:', error.status);
    console.error('Environment:', error.environment);
    console.error('Context:', error.context);
    if (error.cause) {
      console.error('Caused by:', error.cause);
    }
    console.error('Stack:', error.stack);
    console.groupEnd();
  }
};
