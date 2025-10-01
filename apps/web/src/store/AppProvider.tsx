'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 1. Devtools를 import 합니다.
import { ServiceProvider } from './serviceProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: false },
        },
      }),
  );

  return (
    // 1. QueryClientProvider를 무조건적으로 렌더링합니다.
    <QueryClientProvider client={queryClient}>
      {/* 2. 서비스 초기화 로직은 별도의 컴포넌트로 분리합니다. */}
      <ServiceProvider>{children}</ServiceProvider>

      {/* 3. Provider 내부에 Devtools를 추가합니다. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
