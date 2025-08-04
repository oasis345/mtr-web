// File: packages/services/src/error/baseError.ts

/**
 * 에러 생성 시 전달할 수 있는 추가 정보 옵션
 */
export interface BaseErrorOptions {
  cause?: Error; // 에러 체이닝을 위한 원인
  code?: string; // 에러 코드 (예: 'INVALID_INPUT')
  status?: number; // HTTP 상태 코드
}

/**
 * 애플리케이션의 모든 커스텀 에러의 기반이 되는 클래스입니다.
 */
export class BaseError extends Error {
  public readonly cause?: Error;
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, options: BaseErrorOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.cause = options.cause;
    this.code = options.code;
    this.status = options.status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 네트워크 연결 문제를 나타냅니다.
 */
export class NetworkError extends BaseError {
  constructor(message = '네트워크 연결을 확인해주세요.', options?: BaseErrorOptions) {
    super(message, options);
  }
}

/**
 * 분류되지 않은 알 수 없는 에러를 나타냅니다.
 */
export class UnknownError extends BaseError {
  constructor(message = '알 수 없는 오류가 발생했습니다.', options?: BaseErrorOptions) {
    super(message, options);
  }
}
