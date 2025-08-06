import { UiService } from './ui/types';
import { AuthService } from './auth/type';
import { type TokenData } from './auth/tokenProvider';
import { ErrorService } from '../error';
import { HttpClient } from '../api';

/**
 * 모든 환경을 포괄하는 기본 서비스 타입
 */
export interface AppServices {
  authService: AuthService<Promise<TokenData | null> | TokenData | null>;
  errorService: ErrorService;
  httpClient: HttpClient;
  uiService: UiService;
}

/**
 * 🚨 표준적인 해결책: 클라이언트 환경을 위한 구체적인 서비스 타입을 정의합니다.
 * getTokens가 항상 동기(sync)임을 TypeScript에 알려줍니다.
 */
export interface ClientAppServices extends Omit<AppServices, 'authService'> {
  authService: AuthService<TokenData | null>;
}

export const serviceFactory = ({
  errorService,
  httpClient,
  uiService = null,
  authService = null,
}: {
  errorService: ErrorService;
  httpClient: HttpClient;
  authService: AuthService | null;
  uiService: UiService | null;
}) => {
  return {
    authService,
    errorService,
    uiService,
    httpClient,
  };
};
