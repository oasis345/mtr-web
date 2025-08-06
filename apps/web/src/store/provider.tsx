'use client';

import { useAppServiceStore } from '@mtr/ui/client';
import { createClientService } from '@/service/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🚨 next/router에서 변경

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const isInitialized = useAppServiceStore(state => state.isInitialized);
  const initializeServices = useAppServiceStore(state => state.initializeServices);
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      const services = createClientService(router);
      initializeServices(services);
    }
  }, [isInitialized, initializeServices, router]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
