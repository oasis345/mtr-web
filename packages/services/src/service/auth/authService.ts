import { HttpClient } from '../../api/httpClient';
import { ROUTES } from '../../api/routes';
import { AuthUser } from './type';

export class AuthService {
  constructor(private httpClient: HttpClient) {}

  async login(data: unknown): Promise<AuthUser> {
    try {
      const response = await this.httpClient.post<AuthUser>(ROUTES.AUTH.SIGN_IN, data);
      return response.data;
    } catch (error) {
      throw new Error('로그인 실패');
    }
  }

  async signUp(data: unknown): Promise<AuthUser> {
    try {
      const response = await this.httpClient.post<AuthUser>(ROUTES.AUTH.SIGN_UP, data);
      return response.data;
    } catch (error) {
      throw new Error('회원가입 실패');
    }
  }

  async logout(): Promise<void> {}

  // async fetchUserInfo(): Promise<AuthUser> {
  //   try {
  //     const response = await this.httpClient.get<AuthUser>(ROUTES.AUTH.PROFILE);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error('사용자 정보 조회 실패');
  //   }
  // }

  createGoogleLoginUrl(options: { clientId: string; redirectUri: string; scope?: string }): string {
    const { clientId, redirectUri, scope = 'email profile' } = options;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
}
