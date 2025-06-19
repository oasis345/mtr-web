/**
 * @file types.ts
 * @description
 * 이 파일은 크로스 플랫폼 차트 아키텍처에서 사용되는 모든 공용 타입과 인터페이스를 정의합니다.
 * 이 파일에 정의된 타입들은 '의존성 역전 원칙(DIP)'의 핵심 요소로,
 * 고수준 모듈(UI 컴포넌트)과 저수준 모듈(플랫폼별 서비스 구현체) 모두가
 * 구체적인 구현이 아닌 이 추상화(인터페이스)에 의존하게 만듭니다.
 *
 * 주요 역할:
 * 1. ChartService: 모든 플랫폼의 차트 서비스가 반드시 구현해야 하는 기능의 '계약'을 정의합니다.
 * 2. ChartAdapter: 서비스(로직) 계층이 UI(View) 계층과 통신하기 위한 '창구' 역할을 정의합니다.
 * 3. 공용 데이터 타입: 차트 데이터 등 플랫폼 간에 공유되는 데이터 구조를 정의합니다.
 */

// 차트 데이터 포인트의 구조 정의
export interface ChartDataPoint {
  time: string; // 예: '2023-10-27'
  value: number;
}

// 서비스(로직)가 UI(View)와 통신하기 위한 어댑터 인터페이스
// View 컴포넌트는 이 인터페이스를 구현하여 Service에 전달해야 합니다.
export interface ChartAdapter {
  // Service가 View로 메시지를 보낼 때 호출하는 함수
  postMessage: (message: unknown) => void;
  // Service에서 오류 발생 시 View에 알리기 위해 호출하는 함수
  onError: (error: Error) => void;
}

// 모든 플랫폼의 차트 서비스가 구현해야 하는 '계약'
export interface ChartService {
  /**
   * 차트를 초기화하고 생성합니다.
   * @param initialData 초기 차트 데이터
   */
  initialize(initialData: ChartDataPoint[]): void;

  /**
   * 차트의 데이터를 새로운 데이터로 업데이트합니다.
   * @param data 업데이트할 새로운 데이터
   */
  updateData(data: ChartDataPoint[]): void;

  /**
   * 뷰(UI)로부터 메시지를 받았을 때 처리하는 메소드
   * (주로 모바일 웹뷰에서 사용됨)
   * @param message 뷰로부터 받은 메시지
   */
  handleMessage(message: string): void;

  /**
   * 컴포넌트가 언마운트될 때 차트 관련 리소스를 정리합니다.
   */
  destroy(): void;
}

// ChartService 클래스의 생성자 타입을 정의
export type ChartServiceConstructor = new (
  adapter: ChartAdapter,
  chartContainer: HTMLElement | null,
) => ChartService;

// 지원하는 플랫폼 타입을 명시적으로 정의
export type ChartPlatform = 'web' | 'mobile';
