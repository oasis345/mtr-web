import { UiService } from './ui/types';
import { AuthService } from './auth/type';
import { type TokenData } from './auth/tokenProvider';
import { ErrorService } from '../error';
import { HttpClient } from '../api';
import { SocketService } from '../socket';

export interface ClientAppServices {
  authService: AuthService<TokenData | null>;
  errorService: ErrorService;
  httpClient: HttpClient;
  uiService: UiService;
  socketService: SocketService;
}

export interface ServerAppServices {
  authService: AuthService<Promise<TokenData | null>>;
  errorService: ErrorService;
  httpClient: HttpClient;
}
