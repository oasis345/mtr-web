import { type TokenData } from '@mtr/network-core';

export const createClientTokenProvider = () => {
  return {
    getTokens: () => {
      // 이 코드는 클라이언트 컨텍스트에서만 사용됩니다.
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return null;
      return { accessToken };
    },
    setTokens: (tokens: TokenData) => {
      localStorage.setItem('access_token', tokens.accessToken);
    },
    removeTokens: () => {
      localStorage.removeItem('access_token');
    },
  };
};

export const createServerTokenProvider = () => {
  return {
    async getTokens() {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('mtr_access_token')?.value;
      if (!accessToken) return null;
      const refreshToken = cookieStore.get('mtr_refresh_token')?.value;
      return { accessToken, refreshToken: refreshToken || undefined };
    },
    // ... 서버용 set/remove 로직
  };
};
