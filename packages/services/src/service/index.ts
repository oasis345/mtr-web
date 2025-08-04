import { UiService } from './ui/types';
import { AuthService } from './auth/type';
import { ErrorService } from '../error';
import { HttpClient } from '../api';

export const serviceFactory = ({
  errorService,
  httpClient,
  uiService = null,
  authService = null,
}: {
  errorService: ErrorService;
  httpClient: HttpClient;
  authService: AuthService | null;
  uiService: UiService | null;
}) => {
  return {
    authService,
    errorService,
    uiService,
    httpClient,
  };
};

export type AppServices = ReturnType<typeof serviceFactory>;
