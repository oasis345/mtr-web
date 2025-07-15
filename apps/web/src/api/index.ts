import { HttpClient, TokenProvider, type TokenData } from '@mtr/services';

const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 환경 변수 유효성 검사
if (!CLIENT_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_CLIENT_BASE_URL');
}
if (!API_BASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_BASE_URL');
}

// 클라이언트용 TokenProvider
class ClientTokenProvider extends TokenProvider {
  getTokens() {
    if (typeof window === 'undefined') return Promise.resolve(null);

    const accessToken = localStorage.getItem('mtr_access_token');
    if (!accessToken) return Promise.resolve(null);

    return Promise.resolve({
      accessToken,
    });
  }

  setTokens(data: TokenData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mtr_access_token', data.accessToken);
    }
  }
}

// 서버용 TokenProvider
class ServerTokenProvider extends TokenProvider {
  async getTokens(): Promise<TokenData | null> {
    if (typeof window !== 'undefined') {
      return null;
    }

    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();

      const accessToken = cookieStore.get('mtr_access_token')?.value;
      if (!accessToken) return null;

      const refreshToken = cookieStore.get('mtr_refresh_token')?.value;

      return {
        accessToken,
        ...(refreshToken && { refreshToken }),
      };
    } catch (error) {
      console.error('Failed to get token from cookies:', error);
      return null;
    }
  }
}

const getTokenProvider = (): TokenProvider => {
  return typeof window === 'undefined' ? new ServerTokenProvider() : new ClientTokenProvider();
};

export const tokenProvider = getTokenProvider();

export const clientApi = new HttpClient(
  CLIENT_BASE_URL,
  { withCredentials: true, timeout: 10000 },
  tokenProvider,
);

export const serverApi = new HttpClient(
  API_BASE_URL,
  { withCredentials: true, timeout: 10000 },
  tokenProvider,
);
