import { AxiosError } from 'axios';
import {
  BaseError,
  ClientError,
  ServerError,
  NetworkError,
  UnknownError,
  type BaseErrorOptions,
} from './baseError';

type ErrorConverter = (error: unknown) => BaseError;

interface ErrorHandler {
  canHandle: (error: unknown) => boolean;
  convert: ErrorConverter;
}

const isAxiosError = (error: unknown): error is AxiosError =>
  (error as AxiosError).isAxiosError === true;
const isBaseError = (error: unknown): error is BaseError => error instanceof BaseError;

const errorHandlers: ErrorHandler[] = [
  {
    canHandle: isBaseError,
    // error를 unknown으로 받고, BaseError로 단언해줍니다.
    convert: (error: unknown) => error as BaseError,
  },
  {
    canHandle: isAxiosError,
    // error를 unknown으로 받고, 내부에서 AxiosError로 단언해줍니다.
    convert: (error: unknown): BaseError => {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        const message = (data as { message?: string })?.message || '서버 응답에 오류가 있습니다.';
        const code = (data as { code?: string })?.code;
        return status >= 500
          ? new ServerError(message, { code, status, cause: axiosError })
          : new ClientError(message, { code, status, cause: axiosError });
      }
      if (axiosError.request) {
        return new NetworkError('서버로부터 응답이 없습니다. 네트워크를 확인해주세요.', {
          code: axiosError.code,
          cause: axiosError,
        });
      }
      return new ClientError('요청 처리 중 오류가 발생했습니다.', {
        code: 'REQUEST_SETUP_ERROR',
        cause: axiosError,
      });
    },
  },
  {
    canHandle: (error): error is Error => error instanceof Error,
    // error를 unknown으로 받고, 내부에서 Error로 단언해줍니다.
    convert: (error: unknown) => {
      const err = error as Error;
      return new UnknownError(err.message, { cause: err, meta: { stack: err.stack } });
    },
  },
];

export class ErrorService {
  /**
   * 알 수 없는 타입의 에러를 적절한 BaseError 하위 클래스 인스턴스로 변환합니다.
   * (catch 블록 등에서 에러의 종류를 모를 때 사용)
   */
  public static normalize(error: unknown): BaseError {
    const handler = errorHandlers.find(h => h.canHandle(error));
    if (handler) {
      return handler.convert(error);
    }
    return new UnknownError('알 수 없는 오류가 발생했습니다.', { meta: { originalError: error } });
  }

  public static report(error: BaseError) {
    console.error('Reporting error:', error);
    // TODO: Sentry 등 리포팅 로직
  }

  // --- 개발자용 에러 생성 메서드 ---
  // (에러의 종류를 명확히 알고 있을 때 사용)

  public static client(message: string, options?: BaseErrorOptions) {
    return new ClientError(message, options);
  }

  public static server(message: string, options?: BaseErrorOptions) {
    return new ServerError(message, options);
  }

  public static network(message: string, options?: BaseErrorOptions) {
    return new NetworkError(message, options);
  }
}
