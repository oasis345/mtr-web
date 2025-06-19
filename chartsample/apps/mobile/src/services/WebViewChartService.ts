/**
 * @file WebViewChartService.ts
 * @description
 * React Native 모바일 플랫폼을 위한 ChartService의 구체적인 구현체입니다.
 * 이 서비스는 차트를 직접 그리지 않고, 대신 WebView와 통신하는 '대리인(Proxy)' 역할을 합니다.
 * UI 컴포넌트로부터 받은 명령(예: 데이터 업데이트)을 WebView 내부의 웹페이지로 전달합니다.
 *
 * 주요 역할:
 * 1. WebView와 통신: `ChartAdapter`를 통해 WebView로 메시지(명령)를 전송(`postMessage`)합니다.
 * 2. 인터페이스 준수: `ChartService` 인터페이스를 구현하여 UI 컴포넌트가 웹 플랫폼과 동일한 방식으로 상호작용할 수 있도록 보장합니다.
 * 3. 상태 비소유: 차트의 상태나 렌더링에 대한 직접적인 책임을 갖지 않고, 모든 것을 WebView 내의 웹페이지에 위임합니다.
 */

import { ChartService, ChartAdapter, ChartDataPoint } from 'packages/chart-core/src/types';

export class WebViewChartService implements ChartService {
  private adapter: ChartAdapter;

  constructor(adapter: ChartAdapter, chartContainer: HTMLElement | null) {
    // 모바일에서는 chartContainer가 필요 없으므로 무시합니다.
    // adapter는 React Native의 WebView ref와 통신하는 로직을 포함하게 됩니다.
    this.adapter = adapter;
    console.log('[WebViewChartService] 정보: 서비스 생성 완료.');
  }

  // 초기화 시 특별한 로직은 없지만, WebView 로딩 후 초기 데이터를 보낼 수는 있습니다.
  public initialize(initialData: ChartDataPoint[]): void {
    console.log('[WebViewChartService] 정보: 초기화 호출됨. 초기 데이터를 WebView로 전송합니다.');
    // `postMessage`를 사용하여 WebView 내부의 웹페이지에 데이터를 전달합니다.
    this.adapter.postMessage({
      type: 'INITIALIZE_CHART',
      payload: initialData,
    });
    // 하지만 현재 chart-embed.tsx는 자체 초기 데이터를 가지고 있으므로,
    // 이 메시지를 처리하는 로직은 추가 구현이 필요합니다.
    // 여기서는 updateData와 동일한 포맷을 사용하겠습니다.
    this.updateData(initialData);
  }

  public updateData(data: ChartDataPoint[]): void {
    console.log('[WebViewChartService] 정보: 데이터 업데이트. WebView로 전송합니다.');
    this.adapter.postMessage({
      type: 'UPDATE_DATA',
      payload: data,
    });
  }

  // React Native의 WebView로부터 메시지를 수신했을 때 호출될 메소드.
  // 실제 메시지 수신 로직은 WebView를 사용하는 UI 컴포넌트(Chart.tsx)의 onMessage 핸들러에 있습니다.
  // 이 서비스는 그 결과를 UI 컴포넌트로부터 전달받아 처리할 수 있습니다.
  public handleMessage(message: string): void {
    try {
      const parsed = JSON.parse(message);
      console.log(`[WebViewChartService] 정보: UI 컴포넌트로부터 처리된 메시지 수신:`, parsed);
      // 예: 수신한 메시지를 기반으로 상태를 업데이트하거나 다른 로직을 트리거
    } catch (e) {
      console.error('[WebViewChartService] 오류: 메시지 파싱 실패', e);
    }
  }

  // 리소스 정리가 필요한 경우 여기에 로직을 추가합니다.
  public destroy(): void {
    console.log('[WebViewChartService] 정보: 서비스 리소스 정리.');
    // 특별히 정리할 리소스가 없을 수 있습니다.
  }
}
