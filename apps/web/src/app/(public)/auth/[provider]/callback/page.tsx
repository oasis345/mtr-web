'use client';

import { useEffect } from 'react';
import { tokenProvider } from '@/api';

const GoogleCallbackPage = () => {
  useEffect(() => {
    const getTokens = () => {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('mtr_access_token='))
        ?.split('=')[1];

      tokenProvider.setTokens({ accessToken: accessToken ?? '' });
    };
    void getTokens();
  }, []);

  return (
    <div>
      <p>Google 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;
