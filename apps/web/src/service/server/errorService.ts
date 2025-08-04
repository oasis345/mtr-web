import { BaseError, BaseErrorOptions, normalizeError, type ErrorHandler } from '@mtr/services';

const serverErrorHandlers: ErrorHandler[] = [
  {
    canHandle: (e): e is WebServerError => e instanceof WebServerError,
    handle: e => e as WebServerError,
  },
];

const normalize = (error: unknown) => normalizeError(error, serverErrorHandlers);

class WebServerError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, options);
  }
}

export const serverErrorService = { normalize };
