'use client';

import { create, type StoreApi, type UseBoundStore } from 'zustand';

interface AppServiceState<T> {
  services: T | null;
  isInitialized: boolean;
  initializeServices: (services: T) => void;
}

export function createAppServiceStore<T>(): UseBoundStore<StoreApi<AppServiceState<T>>> {
  return create<AppServiceState<T>>(set => ({
    services: null,
    isInitialized: false,
    initializeServices: (services: T) => {
      set({ services, isInitialized: true });
    },
  }));
}

export function createUseAppServices<T>(useStore: UseBoundStore<StoreApi<AppServiceState<T>>>): () => T {
  return (): T => {
    const store = useStore();

    if (!store.isInitialized || !store.services) {
      throw new Error('useAppServices must be used after services are initialized.');
    }

    return store.services;
  };
}
