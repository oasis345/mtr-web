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
export interface AuthService {
  login(): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  refreshToken(): Promise<void>;
}
