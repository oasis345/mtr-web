import { HttpClient } from '../../api/httpClient';
import { AuthService, SigninRequest, SigninResponse } from './type';
import { TokenProvider } from './tokenProvider';

export type OauthConfig = {
  clientId: string;
  redirectUri: string;
  scope?: string;
};

export const createAuthService = (
  httpClient: HttpClient,
  tokenProvider: TokenProvider,
  oauthConfig: OauthConfig,
): AuthService => {
  const signin = async (params: SigninRequest) => {
    return await httpClient.post<SigninResponse>('/auth/signin', params);
  };

  const signout = async () => {
    return await httpClient.post('/auth/signout', {});
  };

  const getTokens = async () => {
    return await tokenProvider.getTokens();
  };

  const getGoogleLoginUrl = () => {
    const { clientId, redirectUri, scope = 'email profile' } = oauthConfig;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return {
    signin,
    signout,
    getTokens,
    getGoogleLoginUrl,
  };
};
