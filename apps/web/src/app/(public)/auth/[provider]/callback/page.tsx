'use client';

import { useEffect } from 'react';
import { useAppServices } from '@mtr/ui/client';

const GoogleCallbackPage = () => {
  const { authService, uiService } = useAppServices();
  useEffect(() => {
    const tokens = authService.getTokens();
    authService.setTokens(tokens);

    uiService.navigate.push('/');
  }, [authService, uiService]);

  return (
    <div>
      <p>Google 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;
