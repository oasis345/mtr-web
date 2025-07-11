/**
 * @file factory.ts
 * @description
 * 이 파일은 크로스 플랫폼 차트 아키텍처의 핵심 허브 역할을 합니다.
 * '등록 패턴(Registry Pattern)'과 '팩토리 패턴(Factory Pattern)'을 사용하여
 * 각 플랫폼(웹, 모바일)에 맞는 차트 서비스(ChartService)의 구현체를 관리하고 생성합니다.
 *
 * 주요 역할:
 * 1. 플랫폼별 서비스 등록: 웹(_app.tsx), 모바일(App.tsx)의 진입점에서 자신의 환경에 맞는 서비스 클래스를 등록합니다.
 * 2. 서비스 인스턴스 생성: UI 컴포넌트에서는 이 팩토리를 통해 현재 플랫폼에 맞는 서비스 인스턴스를 얻습니다.
 * 3. 의존성 분리: 이 팩토리 덕분에 `chart-core` 패키지는 웹이나 모바일의 특정 구현 기술에 대해 전혀 알 필요가 없으며,
 *    UI 컴포넌트 또한 구체적인 서비스 클래스가 아닌 `ChartService` 인터페이스에만 의존하게 됩니다.
 */
import type { ChartService, ChartServiceConstructor, ChartAdapter, ChartPlatform } from './types';

// 등록된 서비스 생성자들을 저장할 맵
const serviceRegistry = new Map<ChartPlatform, ChartServiceConstructor>();

/**
 * ChartServiceFactory는 싱글톤(Singleton)으로 관리됩니다.
 * register: 플랫폼별 서비스 클래스(생성자)를 등록합니다.
 * create: 등록된 서비스 클래스를 바탕으로 실제 서비스 인스턴스를 생성합니다.
 */
export const ChartServiceFactory = {
  /**
   * 애플리케이션 시작 시점에 각 플랫폼에 맞는 서비스 생성자를 등록합니다.
   * @param platform 'web' 또는 'mobile'과 같은 플랫폼 식별자
   * @param constructor 해당 플랫폼의 ChartService 인터페이스를 구현한 클래스 생성자
   */
  register(platform: ChartPlatform, constructor: ChartServiceConstructor): void {
    if (serviceRegistry.has(platform)) {
      console.warn(
        `[ChartServiceFactory] 경고: '${platform}' 플랫폼에 대한 서비스가 이미 등록되어 있습니다. 덮어씌웁니다.`,
      );
    }
    console.log(`[ChartServiceFactory] 정보: '${platform}' 플랫폼을 위한 서비스 등록 완료.`);
    serviceRegistry.set(platform, constructor);
  },

  /**
   * 현재 플랫폼에 맞는 ChartService 인스턴스를 생성합니다.
   * @param platform 현재 실행 중인 플랫폼 식별자
   * @param adapter View(UI)와 Service 간의 통신을 담당하는 어댑터
   * @param chartContainer 차트가 렌더링될 DOM 요소 또는 참조
   * @returns 생성된 ChartService 인스턴스
   */
  create(
    platform: ChartPlatform,
    adapter: ChartAdapter,
    chartContainer: HTMLElement | null,
  ): ChartService {
    const Constructor = serviceRegistry.get(platform);

    if (!Constructor) {
      throw new Error(
        `[ChartServiceFactory] 오류: '${platform}' 플랫폼에 등록된 서비스를 찾을 수 없습니다. 애플리케이션 진입점에서 register()를 호출했는지 확인하세요.`,
      );
    }

    console.log(
      `[ChartServiceFactory] 정보: '${platform}' 플랫폼을 위한 서비스 인스턴스를 생성합니다.`,
    );
    return new Constructor(adapter, chartContainer);
  },
};
