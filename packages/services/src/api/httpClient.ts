import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { TokenProvider } from '../service/auth/tokenProvider';
import { qs } from '@mtr/utils';
import {
  NetworkError,
  ApiError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../error/baseError';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export type ApiResponsePromise<T> = Promise<ApiResponse<T>>;

export class HttpClient {
  private client: AxiosInstance;

  constructor(
    baseURL: string,
    config?: AxiosRequestConfig,
    private tokenProvider?: TokenProvider,
  ) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: (params: unknown) => {
        if (typeof params === 'object' && params !== null) {
          return qs.stringify(params, { arrayFormat: 'brackets' });
        }
        return '';
      },
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async config => {
        const accessToken = await this.getToken();
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    // ✅ BaseError 클래스들을 직접 활용
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        // 1. 타임아웃/네트워크 에러
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          throw new NetworkError('요청 시간이 초과되었습니다.', {
            cause: error,
            context: { url: error.config?.url, timeout: error.config?.timeout },
          });
        }

        // 2. 네트워크 연결 에러
        if (!error.response) {
          throw new NetworkError('서버와의 연결에 실패했습니다.', {
            cause: error,
            context: { url: error.config?.url },
          });
        }

        // 3. HTTP 상태 코드별로 적절한 BaseError 사용
        const { status, data } = error.response;
        const message = data?.message || error.message || 'API 요청 실패';

        switch (status) {
          case 400:
            throw new ValidationError(message, { cause: error, status });
          case 401:
            throw new AuthError(message, { cause: error, status });
          case 403:
            throw new ForbiddenError(message, { cause: error, status });
          case 404:
            throw new NotFoundError(message, { cause: error, status });
          default:
            throw new ApiError(message, {
              cause: error,
              status,
              context: {
                url: error.config?.url,
                method: error.config?.method,
                responseData: data,
              },
            });
        }
      },
    );
  }

  async get<T>(url: string, params?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }

  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.request<ApiResponse<T>>(config);
    return response.data;
  }

  async getToken() {
    const tokens = await this.tokenProvider?.getTokens();
    return tokens?.accessToken || null;
  }
}
