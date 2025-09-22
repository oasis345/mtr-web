'use client';

import { GlobalErrorFallback } from '@mtr/ui/client';
import { createClientService } from '@/service/client';
import { useEffect, useState } from 'react';
import { ErrorService } from '@mtr/error-handler';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ✅ errorService를 props로 직접 받도록 수정합니다.
function ErrorDisplay({
  error,
  reset,
  errorService,
}: GlobalErrorProps & { errorService: ErrorService }) {
  const normalizedError = errorService.normalize(error);

  useEffect(() => {
    errorService.notify(normalizedError);
  }, [errorService, normalizedError]);

  return (
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
  );
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [clientService] = useState(() => createClientService());

  return (
    <html lang="ko">
      <body>
        <ErrorDisplay error={error} reset={reset} errorService={clientService.errorService} />
      </body>
    </html>
  );
}
