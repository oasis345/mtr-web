import { ApiResponsePromise } from '../../api';
import { TokenData } from './tokenProvider';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

// 플랫폼별 구현을 위한 추상 인터페이스
export type AuthService = {
  signin: (params: SigninRequest) => ApiResponsePromise<SigninResponse>;
  signout: () => ApiResponsePromise<unknown>;
  getTokens: () => Promise<TokenData | null>;
  getGoogleLoginUrl: () => string;
};

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
