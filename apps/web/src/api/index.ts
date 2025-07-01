import { HttpClient, TokenProvider } from '@mtr/services';

const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 클라이언트용 TokenProvider
class ClientTokenProvider extends TokenProvider {
  async getTokens(): Promise<{ accessToken: string; refreshToken?: string } | null> {
    if (typeof window === 'undefined') return null;
    return Promise.resolve({
      accessToken: localStorage.getItem('mtr_access_token'),
      refreshToken: null,
    });
  }

  setTokens(tokens: { accessToken: string; refreshToken?: string }): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mtr_access_token', tokens.accessToken);
    }
  }

  removeTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mtr_access_token');
    }
  }
}

// 서버용 TokenProvider
class ServerTokenProvider extends TokenProvider {
  async getTokens() {
    // 서버 환경이 아니면 조기 반환
    if (typeof window !== 'undefined') {
      return null;
    }

    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return {
        accessToken: cookieStore.get('mtr_access_token')?.value || null,
        refreshToken: cookieStore.get('mtr_refresh_token')?.value || null,
      };
    } catch (error) {
      // 에러 타입을 명시적으로 처리
      console.error('Failed to get token from cookies:', error);
      return null;
    }
  }
}

const getTokenProvider = (): TokenProvider => {
  return typeof window === 'undefined'
    ? new ServerTokenProvider() // 서버
    : new ClientTokenProvider(); // 클라이언트
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
