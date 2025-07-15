/**
 * @file _app.tsx
 * @description
 * Next.js 웹 애플리케이션의 최상위 진입점 컴포넌트입니다.
 * 이 파일의 가장 중요한 역할은 애플리케이션이 로드되는 시점에
 * 웹 플랫폼에 특화된 `LightweightChartsService`를 `ChartServiceFactory`에 등록하는 것입니다.
 *
 * 이 등록 과정을 통해, 앱 내의 모든 페이지나 컴포넌트에서 ChartServiceFactory.create('web', ...)를
 * 호출했을 때 `LightweightChartsService`의 인스턴스를 올바르게 반환받을 수 있습니다.
 *
 * 이 파일은 "등록 패턴"을 실제로 구현하는 부분입니다.
 */
import { ChartServiceFactory } from 'packages/chart-core/src/factory';
import { LightweightChartsService } from '../services/LightweightChartsService';
// --- 플랫폼 서비스 등록 ---
// 애플리케이션이 클라이언트 사이드에서 시작될 때 단 한 번만 실행되어야 합니다.
if (typeof window !== 'undefined') {
    console.log('[_app.tsx] 웹 플랫폼 서비스를 등록합니다.');
    ChartServiceFactory.register('web', LightweightChartsService);
}
// -------------------------
function MyApp({ Component, pageProps }) {
    // 실제 애플리케이션에서는 여기에 전역 레이아웃, 상태 관리 프로바이더(Recoil, Redux 등),
    // 테마 프로바이더 등이 위치하게 됩니다.
    return <Component {...pageProps}/>;
}
export default MyApp;
