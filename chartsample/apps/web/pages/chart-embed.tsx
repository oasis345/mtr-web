/**
 * @file chart-embed.tsx
 * @description
 * 이 페이지는 React Native의 WebView 내부에 삽입될 목적으로만 사용되는 특수 페이지입니다.
 * 웹사이트의 일반적인 레이아웃(헤더, 푸터 등)을 포함하지 않고 오직 차트 렌더링에만 집중합니다.
 *
 * 주요 역할:
 * 1. 차트 렌더링: 웹 플랫폼용 `LightweightChartsService`를 사용하여 차트를 화면에 그립니다.
 * 2. React Native로부터의 명령 수신: 웹뷰를 통해 `postMessage`로 전달된 명령(예: 데이터 업데이트)을 수신하고 처리합니다.
 * 3. React Native로의 이벤트 전송: 차트 내부에서 발생한 사용자 인터랙션(예: 클릭)을 `window.ReactNativeWebView.postMessage`를 통해 React Native로 전달합니다.
 *
 * 이 방식을 통해 모바일 앱은 네이티브 차트 라이브러리 없이도 웹의 고품질 차트를 그대로 사용할 수 있습니다.
 */

import React, { useEffect, useRef, useState } from 'react';
import { LightweightChartsService } from '../services/LightweightChartsService';
import { ChartAdapter, ChartDataPoint, ChartService } from 'packages/chart-core/src/types';

// 초기 샘플 데이터
const initialSampleData: ChartDataPoint[] = [
  { time: '2023-01-01', value: 100 },
  { time: '2023-01-02', value: 110 },
  { time: '2023-01-03', value: 105 },
];

const ChartEmbedPage: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartServiceRef = useRef<ChartService | null>(null);
  const [log, setLog] = useState<string[]>([]); // 디버깅용 로그

  // 로그 추가 함수
  const addLog = (message: string) => {
    console.log(message);
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    // --- 1. 서비스 및 어댑터 설정 ---
    const chartAdapter: ChartAdapter = {
      // 웹뷰 내부에서 발생하는 이벤트를 React Native로 전달
      postMessage: message => {
        if (window.ReactNativeWebView) {
          addLog(`RN으로 메시지 전송: ${JSON.stringify(message)}`);
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        } else {
          addLog(`RN WebView가 없어 메시지 전송 실패: ${JSON.stringify(message)}`);
        }
      },
      onError: error => {
        addLog(`오류 발생: ${error.message}`);
      },
    };

    if (chartContainerRef.current && !chartServiceRef.current) {
      addLog('차트 서비스 초기화를 시작합니다.');
      // 웹 환경이므로 LightweightChartsService를 직접 생성합니다.
      // (팩토리를 사용하지 않는 이유는 이 페이지는 항상 웹 서비스만 사용하기 때문)
      const service = new LightweightChartsService(chartAdapter, chartContainerRef.current);
      service.initialize(initialSampleData);
      chartServiceRef.current = service;
    }

    // --- 2. React Native로부터 메시지 수신 리스너 설정 ---
    const handleMessageFromReactNative = (event: MessageEvent) => {
      addLog(`RN으로부터 메시지 수신: ${event.data}`);
      if (chartServiceRef.current) {
        // 이 페이지에서는 서비스의 handleMessage를 직접 호출합니다.
        chartServiceRef.current.handleMessage(event.data);

        // 실제 애플리케이션에서는 event.data를 파싱하여 더 복잡한 로직을 수행합니다.
        // 예: const { type, payload } = JSON.parse(event.data);
        // if (type === 'UPDATE_DATA') service.updateData(payload);
        try {
          const { type, payload } = JSON.parse(event.data);
          if (type === 'UPDATE_DATA' && Array.isArray(payload)) {
            addLog(`데이터 업데이트 명령 수신`);
            chartServiceRef.current.updateData(payload);
          }
        } catch (e) {
          addLog('수신한 메시지 파싱 실패');
        }
      }
    };

    // 웹 환경(브라우저)과 React Native WebView 환경을 모두 지원
    window.addEventListener('message', handleMessageFromReactNative);
    document.addEventListener('message', handleMessageFromReactNative as EventListener);

    // --- 3. 컴포넌트 언마운트 시 리소스 정리 ---
    return () => {
      addLog('컴포넌트 정리 및 리스너 제거');
      window.removeEventListener('message', handleMessageFromReactNative);
      document.removeEventListener('message', handleMessageFromReactNative as EventListener);
      chartServiceRef.current?.destroy();
    };
  }, []);

  return (
    <div
      style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', backgroundColor: '#f0f0f0' }}
    >
      {/* 차트가 그려질 컨테이너 */}
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* 디버깅용 로그 뷰어 (실제 프로덕션에서는 제거) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          overflowY: 'scroll',
          fontSize: '10px',
          padding: '5px',
          fontFamily: 'monospace',
        }}
      >
        <h4 style={{ margin: '0 0 5px 0', padding: 0 }}>WebView Log</h4>
        {log.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default ChartEmbedPage;

// React Native WebView 환경에서 postMessage를 사용하기 위한 타입 선언
declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}
