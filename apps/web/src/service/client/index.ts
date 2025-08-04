import { AppServices, createAuthService, HttpClient } from '@mtr/services';
import { createUiService } from './uiService';
import { tokenProvider } from '../tokenProvider';
import { CLIENT_BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../config';
import { createErrorService } from './errorService';

export function createClientService(): AppServices {
  const httpClient = new HttpClient(
    CLIENT_BASE_URL,
    { withCredentials: true, timeout: 10000 },
    tokenProvider,
  );

  const authService = createAuthService(httpClient, tokenProvider, {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: GOOGLE_REDIRECT_URI,
  });

  const uiService = createUiService();
  const errorService = createErrorService(uiService);

  return {
    authService,
    errorService,
    httpClient,
    uiService,
  };
}
