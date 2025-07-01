import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { TokenProvider } from '../service/auth/tokenProvider';
import { qs } from '@mtr/utils';

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
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
        const tokens = await this.tokenProvider?.getTokens();
        const accessToken = tokens?.accessToken;
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    // 응답 인터셉터 - 에러 처리
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // 인증 에러 처리 로직
          throw new Error('Unauthorized');
        }
        throw new Error('API Error');
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
}
