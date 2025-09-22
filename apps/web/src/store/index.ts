import { createAppServiceStore, createUseAppServices } from '@mtr/store';
import type { ClientAppServices } from '@/service/client'; // 여기서만 서비스 타입을 임포트

// 1. 'ClientAppServices' 타입으로 제네릭 스토어를 생성합니다.
export const useAppServiceStore = createAppServiceStore<ClientAppServices>();

// 2. 생성된 스토어를 사용하여, 타입이 완벽하게 적용된 최종 훅을 만듭니다.
export const useAppServices = createUseAppServices(useAppServiceStore);