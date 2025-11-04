import { BaseError, BaseErrorOptions, type ErrorHandler, logError, normalizeError } from '@mtr/error-handler';
import { UiService } from '@mtr/ui';

/**
 * 클라이언트 전용 에러 클래스
 */
class WebClientError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, { code: 'WEB_CLIENT_ERROR', ...options });
  }
}

/**
 * 클라이언트 환경 전용 에러 핸들러들
 */
const clientErrorHandlers: ErrorHandler[] = [
  // 클라이언트 전용 에러 처리
  {
    canHandle: (e): e is WebClientError => e instanceof WebClientError,
    handle: e => e as WebClientError,
  },

  // 브라우저 API 에러 처리
  {
    canHandle: (error): error is DOMException => error instanceof DOMException,
    handle: (error: Error) =>
      new WebClientError(`브라우저 API 오류: ${error.message}`, {
        cause: error,
        code: 'DOM_EXCEPTION',
      }),
  },
];

export const createErrorService = (uiService: UiService) => {
  const normalize = (error: unknown) => normalizeError(error, clientErrorHandlers);
  const notify = (error: unknown) => {
    const normalizedError = normalize(error);
    logError(normalizedError);

    uiService.notify({
      message: normalizedError.getSafeMessage(),
      type: 'error',
    });
  };

  return { normalize, notify };
};
