/**
 * @file App.tsx
 * @description
 * React Native 모바일 애플리케이션의 최상위 루트 컴포넌트입니다.
 * 이 파일의 가장 중요한 역할은 애플리케이션이 로드되는 시점에
 * 모바일 플랫폼에 특화된 `WebViewChartService`를 `ChartServiceFactory`에 등록하는 것입니다.
 *
 * 이 등록 과정을 통해, 앱 내의 모든 화면이나 컴포넌트에서 ChartServiceFactory.create('mobile', ...)를
 * 호출했을 때 `WebViewChartService`의 인스턴스를 올바르게 반환받을 수 있습니다.
 *
 * 이 파일은 `_app.tsx`와 짝을 이루어 "등록 패턴"을 완성하는 파일입니다.
 */

import React from 'react';
import { StatusBar } from 'react-native';

import { ChartServiceFactory } from 'packages/chart-core/src/factory';
import { WebViewChartService } from './src/services/WebViewChartService';
import { Chart } from './src/components/Chart';

// --- 플랫폼 서비스 등록 ---
// 애플리케이션이 시작될 때 단 한 번만 실행됩니다.
console.log('[App.tsx] 모바일 플랫폼 서비스를 등록합니다.');
ChartServiceFactory.register('mobile', WebViewChartService);
// -------------------------

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {/* 
        실제 앱에서는 여기에 네비게이션 컨테이너(예: React Navigation)가 위치하고,
        Chart 컴포넌트는 특정 스크린 내부에 렌더링될 것입니다.
        이 샘플에서는 간단히 Chart 컴포넌트를 바로 렌더링합니다.
      */}
      <Chart />
    </>
  );
};

export default App;
