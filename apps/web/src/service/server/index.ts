import { AppServices, HttpClient } from '@mtr/services';
import { API_BASE_URL } from '../config';
import { tokenProvider } from '../tokenProvider';
import { serverErrorService } from './errorService';

const serverHttpClient = new HttpClient(
  API_BASE_URL,
  { withCredentials: true, timeout: 10000 },
  tokenProvider,
);

export const serverService: AppServices = {
  errorService: serverErrorService,
  httpClient: serverHttpClient,
  authService: null,
  uiService: null,
};
