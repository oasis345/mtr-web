export const ROUTES = {
  // Auth 관련
  AUTH: {
    SIGN_IN: '/auth/signIn',
    SIGN_UP: '/auth/signUp',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },
} as const;

// 타입 안전성을 위한 헬퍼
export type ApiEndpoint = typeof ROUTES;
