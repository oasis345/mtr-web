'use client';

import type { ClientAppServices } from '@mtr/services';
import { create } from 'zustand';

// 1. 스토어의 상태 타입 정의
interface AppServiceState {
  services: ClientAppServices;
  isInitialized: boolean;
  initializeServices: (services: ClientAppServices) => void;
}

// 2. 스토어 생성
// 초기 상태는 null이며, isInitialized는 false입니다.
export const useAppServiceStore = create<AppServiceState>(set => ({
  services: null,
  isInitialized: false,
  initializeServices: (services: ClientAppServices) => {
    set({ services, isInitialized: true });
    console.log('✅ AppServices initialized in Zustand store.');
  },
}));

// 3. 서비스를 사용하기 위한 커스텀 훅
// 이 훅은 서비스가 초기화되었는지 확인하고, 안전하게 서비스를 반환합니다.
export function useAppServices(): ClientAppServices {
  const store = useAppServiceStore();

  if (!store.isInitialized || !store.services) {
    throw new Error('useAppServices must be used after services are initialized.');
  }

  return store.services;
}
