import { HttpClient, SocketService } from '@mtr/network-core';
import { createAuthService } from '@mtr/auth-core';
import { createUiService } from './uiService';
import { createClientTokenProvider } from '../tokenProvider';
import { CLIENT_BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../config';
import { createErrorService } from './errorService';
import { createFinancialService, FinancialService } from '@mtr/finance-core';
import { AuthService } from '@mtr/auth-core';
import { ErrorService } from '@mtr/error-handler';
import { UiService } from '@mtr/ui';

export interface ClientAppServices {
  authService: AuthService;
  errorService: ErrorService;
  httpClient: HttpClient;
  uiService: UiService;
  socketService: SocketService;
  financialService: FinancialService;
}

export function createClientService(): ClientAppServices {
  const tokenProvider = createClientTokenProvider();
  const httpClient = new HttpClient(
    CLIENT_BASE_URL,
    { withCredentials: true, timeout: 20000 },
    tokenProvider,
  );

  const authService = createAuthService(httpClient, tokenProvider, {
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: GOOGLE_REDIRECT_URI,
  });

  const uiService = createUiService();
  const errorService = createErrorService(uiService);
  const socketService = new SocketService({
    url: process.env.NEXT_PUBLIC_API_BASE_URL,
    reconnectionAttempts: 2,
  });
  const financialService = createFinancialService(httpClient);

  return {
    authService,
    errorService,
    httpClient,
    uiService,
    socketService,
    financialService,
  };
}
