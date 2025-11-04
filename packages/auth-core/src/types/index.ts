import { ApiResponsePromise, TokenData } from '@mtr/network-core';

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

// getTokens의 반환 타입을 제네릭 T로 변경
export type AuthService<T = Promise<TokenData>> = {
  signIn: (params: SigninRequest) => ApiResponsePromise<SigninResponse>;
  signOut: () => ApiResponsePromise<unknown>;
  getGoogleLoginUrl: () => string;
  getTokens: () => T;
  setTokens?: (tokens: TokenData) => void;
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

export interface OauthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string;
}
