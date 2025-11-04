import { BaseError, BaseErrorOptions, type ErrorHandler, logError, normalizeError } from '@mtr/error-handler';

/**
 * 서버 전용 에러 클래스
 */
class WebServerError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, { code: 'WEB_SERVER_ERROR', ...options });
  }
}

/**
 * 서버 환경 전용 에러 핸들러들
 */
const serverErrorHandlers: ErrorHandler[] = [
  {
    canHandle: (e): e is WebServerError => e instanceof WebServerError,
    handle: e => e as WebServerError,
  },

  // Node.js 에러 처리
  {
    canHandle: (error: Error): error is NodeJS.ErrnoException =>
      typeof error === 'object' && error !== null && 'code' in error && 'errno' in error,
    handle: (error: NodeJS.ErrnoException) =>
      new WebServerError(`시스템 오류: ${error.message}`, {
        cause: error,
        code: error.code,
        context: { errno: error.errno },
      }),
  },
];

export const serverErrorService = {
  normalize: (error: unknown) => normalizeError(error, serverErrorHandlers),
  log: logError,
};
