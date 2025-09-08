import { createAuthService, HttpClient, ServerAppServices } from '@mtr/services';
import { API_BASE_URL } from '../config';
import { createServerTokenProvider } from '../tokenProvider';
import { serverErrorService } from './errorService';

const tokenProvider = createServerTokenProvider();
const httpClient = new HttpClient(
  API_BASE_URL,
  { withCredentials: true, timeout: 10000 },
  tokenProvider,
);

const authService = createAuthService(httpClient, tokenProvider);

export const appServices: ServerAppServices = {
  authService,
  errorService: serverErrorService,
  httpClient,
};
