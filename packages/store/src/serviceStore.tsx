'use client';

import { create, type StoreApi, type UseBoundStore } from 'zustand';

// 1. [수정] 제네릭 상태 인터페이스. services는 T 또는 null일 수 있습니다.
interface AppServiceState<T> {
  services: T | null;
  isInitialized: boolean;
  initializeServices: (services: T) => void;
}

// 2. [핵심] 스토어를 생성하는 '팩토리 함수'. 이 함수가 제네릭 <T>를 받습니다.
export function createAppServiceStore<T>(): UseBoundStore<StoreApi<AppServiceState<T>>> {
  return create<AppServiceState<T>>(set => ({
    services: null,
    isInitialized: false,
    // [수정] 이제 services의 타입은 제네릭 T를 올바르게 따릅니다.
    initializeServices: (services: T) => {
      set({ services, isInitialized: true });
    },
  }));
}

// 3. [핵심] 서비스를 사용하기 위한 커스텀 훅을 생성하는 '팩토리 함수'
export function createUseAppServices<T>(
  useStore: UseBoundStore<StoreApi<AppServiceState<T>>>,
): () => T {
  // 이 함수는 실제 커스텀 훅을 반환합니다.
  return (): T => {
    const store = useStore();

    if (!store.isInitialized || !store.services) {
      throw new Error('useAppServices must be used after services are initialized.');
    }

    return store.services;
  };
}
