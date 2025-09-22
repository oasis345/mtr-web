import { AuthService, SigninRequest, SigninResponse, HttpClient,TokenProvider, TokenData } from '@mtr/network-core';
import { OauthConfig,  } from './type';

// 팩토리 함수에 제네릭 <T> 추가
export const createAuthService = <T>(
  httpClient: HttpClient,
  tokenProvider: TokenProvider<T>, // 제네릭 타입의 TokenProvider를 받음
  oauthConfig?: OauthConfig,
): AuthService<T> => {
  // 제네릭 타입의 AuthService를 반환
  const signin = async (params: SigninRequest) => {
    return await httpClient.post<SigninResponse>('/auth/signin', params);
  };

  const signout = async () => {
    return await httpClient.post('/auth/signout', {});
  };

  const getGoogleLoginUrl = () => {
    if (!oauthConfig) throw new Error('OauthConfig is not provided');
    const { clientId, redirectUri, scope = 'email profile' } = oauthConfig;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const getTokens = () => {
    // 받은 tokenProvider의 getTokens를 그대로 사용
    return tokenProvider.getTokens();
  };

  const setTokens = (tokens: TokenData) => {
    tokenProvider.setTokens?.(tokens);
  };

  return {
    signin,
    signout,
    getTokens,
    setTokens,
    getGoogleLoginUrl,
  };
};
