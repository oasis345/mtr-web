'use client';

import { useCallback, useMemo } from 'react';
import { ROUTES, type LoginFormFields } from '@mtr/services';
import { services } from '@/service';

export const useAuth = () => {
  const { authService } = services;

  const googleLoginUrl = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 환경 변수 유효성 검사
    if (!clientId) {
      console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined');
      return '';
    }
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not defined');
      return '';
    }

    const redirectUri = `${baseUrl}${ROUTES.AUTH.GOOGLE_CALLBACK}`;
    const scope = 'email profile';
    const url = authService.createGoogleLoginUrl({ clientId, redirectUri, scope });

    return url;
  }, [authService]);

  const signin = useCallback(
    async (data: LoginFormFields): Promise<void> => {
      await authService.login(data);
    },
    [authService],
  );

  return {
    signin,
    googleLoginUrl,
  };
};
