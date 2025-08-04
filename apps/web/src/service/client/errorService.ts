import { BaseErrorOptions, normalizeError, type ErrorHandler, type UiService } from '@mtr/services';
import { BaseError } from '@mtr/services';

const clientErrorHandlers: ErrorHandler[] = [
  {
    canHandle: (e): e is WebClientError => e instanceof WebClientError,
    handle: e => e as WebClientError,
  },
];

class WebClientError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, options);
  }
}

export const createErrorService = (uiService: UiService) => {
  const normalize = (error: unknown) => normalizeError(error, clientErrorHandlers);
  const notify = (error: BaseError) => uiService.notify({ message: error.message, type: 'error' });
  return { normalize, notify };
};
