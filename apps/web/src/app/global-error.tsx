'use client';

import { ErrorService } from '@mtr/services';
import { GlobalErrorFallback } from '@mtr/ui';
import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const normalizedError = ErrorService.normalize(error);

  useEffect(() => {
    ErrorService.report(normalizedError);
  }, []);

  return (
    <html lang="ko">
      <body>
        <GlobalErrorFallback
          error={normalizedError}
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
