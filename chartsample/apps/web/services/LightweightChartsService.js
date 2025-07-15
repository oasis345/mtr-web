/**
 * @file LightweightChartsService.ts
 * @description
 * 웹 플랫폼을 위한 ChartService의 구체적인 구현체입니다.
 * 'lightweight-charts' 라이브러리를 직접 사용하여 차트를 렌더링하고 조작합니다.
 * 이 클래스는 `ChartService` 인터페이스를 구현하며, 웹 애플리케이션의 UI 컴포넌트에서 사용됩니다.
 *
 * 주요 역할:
 * 1. 차트 생성 및 초기화: 주어진 DOM 컨테이너에 lightweight-charts 인스턴스를 생성합니다.
 * 2. 데이터 관리: 차트 시리즈에 데이터를 설정하고 업데이트합니다.
 * 3. 리소스 정리: 컴포넌트가 언마운트될 때 차트 인스턴스와 이벤트 리스너를 안전하게 제거합니다.
 */
// lightweight-charts 라이브러리와 공용 타입을 임포트합니다.
// 실제 프로젝트에서는 `pnpm add lightweight-charts`를 통해 패키지를 설치해야 합니다.
import { createChart } from 'lightweight-charts';
export class LightweightChartsService {
    chart = null;
    series = null;
    adapter;
    container;
    constructor(adapter, chartContainer) {
        if (!chartContainer) {
            const error = new Error('[LightweightChartsService] 오류: 차트를 초기화할 수 없습니다. 유효한 HTML 컨테이너가 필요합니다.');
            adapter.onError(error);
            throw error;
        }
        this.adapter = adapter;
        this.container = chartContainer;
    }
    initialize(initialData) {
        if (this.chart) {
            console.warn('[LightweightChartsService] 경고: 차트가 이미 초기화되었습니다.');
            return;
        }
        // 차트 생성
        this.chart = createChart(this.container, {
            width: this.container.clientWidth,
            height: 300, // 기본 높이, 필요시 조정
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#e1e1e1' },
                horzLines: { color: '#e1e1e1' },
            },
        });
        // 라인 시리즈 추가
        this.series = this.chart.addLineSeries({
            color: '#2962FF',
            lineWidth: 2,
        });
        // 초기 데이터 설정
        const formattedData = initialData.map(d => ({ time: d.time, value: d.value }));
        this.series.setData(formattedData);
        console.log('[LightweightChartsService] 정보: 차트 초기화 및 데이터 설정 완료.');
        // 컨테이너 리사이즈에 대응하기 위한 로직 (예시)
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.chart?.resize(width, height);
            }
        });
        resizeObserver.observe(this.container);
    }
    updateData(data) {
        if (!this.series) {
            const error = new Error('[LightweightChartsService] 오류: 데이터를 업데이트할 수 없습니다. 시리즈가 초기화되지 않았습니다.');
            this.adapter.onError(error);
            return;
        }
        const formattedData = data.map(d => ({ time: d.time, value: d.value }));
        this.series.setData(formattedData);
        console.log('[LightweightChartsService] 정보: 차트 데이터 업데이트 완료.');
    }
    // 웹에서는 handleMessage가 직접 사용되지 않을 수 있으나,
    // 인터페이스 계약을 위해 구현합니다.
    handleMessage(message) {
        console.log(`[LightweightChartsService] 정보: 메시지 수신(웹에서는 무시됨): ${message}`);
    }
    destroy() {
        if (this.chart) {
            this.chart.remove();
            this.chart = null;
            console.log('[LightweightChartsService] 정보: 차트 리소스 정리 완료.');
        }
    }
}
