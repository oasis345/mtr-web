import { AuthService, createAuthService } from '@mtr/auth-core';
import { ErrorService } from '@mtr/error-handler';
import { createFinancialService, FinancialService } from '@mtr/finance-core';
import { HttpClient } from '@mtr/network-core';
import { API_BASE_URL } from '../config';
import { createServerTokenProvider } from '../tokenProvider';
import { serverErrorService } from './errorService';

export interface ServerAppServices {
  authService: AuthService;
  errorService: ErrorService;
  httpClient: HttpClient;
  financialService: FinancialService;
}

const tokenProvider = createServerTokenProvider();
const httpClient = new HttpClient(API_BASE_URL, { withCredentials: true, timeout: 10000 }, tokenProvider);
const authService = createAuthService(httpClient, tokenProvider);
const financialService = createFinancialService(httpClient);

export const appServices: ServerAppServices = {
  authService,
  errorService: serverErrorService,
  httpClient,
  financialService,
};
