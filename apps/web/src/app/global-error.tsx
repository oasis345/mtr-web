'use client';

import { GlobalErrorFallback } from '@mtr/ui';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body>
        <GlobalErrorFallback
          error={error}
          reset={reset}
          branding={{
            appName: 'MTR 웹 서비스',
            supportEmail: 'support@mtr.com',
            logoUrl: '/logo.png',
          }}
          environment={process.env.NODE_ENV as 'development' | 'production'}
        />
      </body>
    </html>
  );
}
