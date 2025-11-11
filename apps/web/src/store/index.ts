import { createAppServiceStore, createUseAppServices } from '@mtr/store';
import type { ClientAppServices } from '@/service/client'; // 여기서만 서비스 타입을 임포트

export const useAppServiceStore = createAppServiceStore<ClientAppServices>();
export const useAppServices = createUseAppServices(useAppServiceStore);
