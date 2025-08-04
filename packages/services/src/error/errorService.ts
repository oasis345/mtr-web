import { BaseError } from './baseError';

// 특정 에러 핸들러 로직은 외부(apps/web)에서 주입받는다.
export type ErrorHandler = {
  canHandle: (error: unknown) => boolean;
  handle: (error: unknown) => BaseError;
};

// 순수하게 에러를 정규화만 해주는 헬퍼 함수
export const normalizeError = (error: unknown, handlers: ErrorHandler[]): BaseError => {
  const handler = handlers.find(h => h.canHandle(error));
  if (handler) {
    return handler.handle(error);
  }
  // ... 기본 에러 처리 ...
  return new BaseError('알 수 없는 오류');
};

export type ErrorService = {
  normalize: (error: unknown) => BaseError;
  notify?: (error: BaseError) => void;
};
