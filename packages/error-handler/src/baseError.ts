/**
 * 에러 생성 시 전달할 수 있는 추가 정보 옵션
 */
export interface BaseErrorOptions {
  cause?: Error; // 에러 체이닝을 위한 원인
  code?: string; // 에러 코드 (예: 'INVALID_INPUT')
  status?: number; // HTTP 상태 코드
  context?: Record<string, unknown>; // 디버깅을 위한 추가 컨텍스트
}

/**
 * 에러 환경 구분
 */
export type ErrorEnvironment = 'client' | 'server';

/**
 * 애플리케이션의 모든 커스텀 에러의 기반이 되는 클래스입니다.
 */
export class BaseError extends Error {
  public readonly cause?: Error;
  public readonly code?: string;
  public readonly status?: number;
  public readonly context?: Record<string, unknown>;
  public readonly environment: ErrorEnvironment;
  public readonly timestamp: Date;

  constructor(message: string, options: BaseErrorOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.cause = options.cause;
    this.code = options.code;
    this.status = options.status;
    this.context = options.context;
    this.timestamp = new Date();

    // 환경 감지
    this.environment = this.detectEnvironment();

    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * 에러를 JSON으로 직렬화
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      context: this.context,
      environment: this.environment,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  /**
   * 사용자에게 표시할 안전한 메시지 반환
   */
  getSafeMessage(): string {
    // 개발 환경에서는 전체 메시지, 프로덕션에서는 일반적인 메시지
    if (process.env.NODE_ENV === 'development') {
      return this.message;
    }

    // 프로덕션에서는 민감한 정보가 포함될 수 있는 메시지를 필터링
    return this.status && this.status >= 500 ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' : this.message;
  }

  private detectEnvironment(): ErrorEnvironment {
    if (typeof window !== 'undefined') return 'client';
    return 'server';
  }
}

// === 타입 가드 함수들 ===

/**
 * 값이 Error 인스턴스인지 확인
 */
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

/**
 * 값이 BaseError 인스턴스인지 확인
 */
export const isBaseError = (value: unknown): value is BaseError => {
  return value instanceof BaseError;
};

/**
 * 값이 네이티브 Error인지 확인 (BaseError 제외)
 */
export const isNativeError = (value: unknown): value is Error => {
  return value instanceof Error && !(value instanceof BaseError);
};

/**
 * HTTP 상태 코드를 기반으로 에러 타입 확인
 */
export const isClientError = (error: BaseError): boolean => {
  return !!(error.status && error.status >= 400 && error.status < 500);
};

export const isServerError = (error: BaseError): boolean => {
  return !!(error.status && error.status >= 500);
};

// === 구체적인 에러 클래스들 ===

/**
 * 네트워크 연결 문제를 나타냅니다.
 */
export class NetworkError extends BaseError {
  constructor(message = '네트워크 연결을 확인해주세요.', options?: BaseErrorOptions) {
    super(message, { status: 0, code: 'NETWORK_ERROR', ...options });
  }
}

/**
 * API 요청 실패를 나타냅니다.
 */
export class ApiError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, { code: 'API_ERROR', ...options });
  }
}

/**
 * 인증/인가 실패를 나타냅니다.
 */
export class AuthError extends BaseError {
  constructor(message = '인증이 필요합니다.', options?: BaseErrorOptions) {
    super(message, { status: 401, code: 'AUTH_ERROR', ...options });
  }
}

/**
 * 권한 부족을 나타냅니다.
 */
export class ForbiddenError extends BaseError {
  constructor(message = '접근 권한이 없습니다.', options?: BaseErrorOptions) {
    super(message, { status: 403, code: 'FORBIDDEN_ERROR', ...options });
  }
}

/**
 * 리소스를 찾을 수 없음을 나타냅니다.
 */
export class NotFoundError extends BaseError {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.', options?: BaseErrorOptions) {
    super(message, { status: 404, code: 'NOT_FOUND_ERROR', ...options });
  }
}

/**
 * 사용자 입력 검증 실패를 나타냅니다.
 */
export class ValidationError extends BaseError {
  constructor(message = '입력값이 올바르지 않습니다.', options?: BaseErrorOptions) {
    super(message, { status: 400, code: 'VALIDATION_ERROR', ...options });
  }
}

/**
 * 분류되지 않은 알 수 없는 에러를 나타냅니다.
 */
export class UnknownError extends BaseError {
  constructor(message = '알 수 없는 오류가 발생했습니다.', options?: BaseErrorOptions) {
    super(message, { status: 500, code: 'UNKNOWN_ERROR', ...options });
  }
}

export class AxiosError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, { code: 'AXIOS_ERROR', ...options });
  }
}
