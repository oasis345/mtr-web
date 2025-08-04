'use client';

import { useAppServiceStore } from '@mtr/ui/client';
import { createClientService } from '@/service/client';
import { useEffect } from 'react';

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const isInitialized = useAppServiceStore(state => state.isInitialized);
  const initializeServices = useAppServiceStore(state => state.initializeServices);

  useEffect(() => {
    if (!isInitialized) {
      const services = createClientService();
      initializeServices(services);
    }
  }, [isInitialized, initializeServices]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
