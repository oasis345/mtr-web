'use client';

import { useAppServices } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const GoogleCallbackPage = () => {
  const { authService } = useAppServices();
  const router = useRouter();
  useEffect(() => {
    const tokens = authService.getTokens();
    authService.setTokens(tokens);

    router.push('/');
  }, [authService]);

  return (
    <div>
      <p>Google 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;
