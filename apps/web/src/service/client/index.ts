import {
  createAuthService,
  HttpClient,
  SocketService,
  type ClientAppServices,
} from '@mtr/services';
import { createUiService } from './uiService';
import { createClientTokenProvider } from '../tokenProvider';
import { CLIENT_BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../config';
import { createErrorService } from './errorService';
import { type NavigationOptions } from '@mtr/services';

export function createClientService(router: NavigationOptions): ClientAppServices {
  const tokenProvider = createClientTokenProvider();
  const httpClient = new HttpClient(
    CLIENT_BASE_URL,
    { withCredentials: true, timeout: 10000 },
    tokenProvider,
  );

  const authService = createAuthService(httpClient, tokenProvider, {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: GOOGLE_REDIRECT_URI,
  });

  const uiService = createUiService(router);
  const errorService = createErrorService(uiService);
  const socketService = new SocketService({
    url: process.env.NEXT_PUBLIC_API_BASE_URL,
    reconnectionAttempts: 2,
  });

  return {
    authService,
    errorService,
    httpClient,
    uiService,
    socketService,
  };
}
