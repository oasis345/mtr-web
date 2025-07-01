import { AuthService } from './auth/authService';
import { HttpClient } from '../api/httpClient';

export const serviceFactory = (httpClient: HttpClient) => ({
  authService: new AuthService(httpClient),
});
