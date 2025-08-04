import { TokenProvider } from '@mtr/services';
import { isServer } from './config';

const createTokenProvider = (): TokenProvider => {
  if (isServer) {
    return {
      async getTokens() {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('mtr_access_token')?.value;
        if (!accessToken) return null;

        const refreshToken = cookieStore.get('mtr_refresh_token')?.value;
        return { accessToken, refreshToken: refreshToken || undefined };
      },
    };
  }
  return {
    async getTokens() {
      const accessToken =
        localStorage.getItem('mtr_access_token') ||
        document.cookie
          .split('; ')
          .find(row => row.startsWith('mtr_access_token='))
          ?.split('=')[1];

      if (!accessToken) return null;
      return Promise.resolve({ accessToken });
    },
    setTokens(tokens) {
      localStorage.setItem('mtr_access_token', tokens.accessToken);
    },
    removeTokens() {
      localStorage.removeItem('mtr_access_token');
    },
  };
};

export const tokenProvider = createTokenProvider();
