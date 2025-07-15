/**
 * @file Chart.tsx
 * @description
 * React Native에서 차트를 표시하기 위한 UI 컴포넌트입니다.
 * 이 컴포넌트는 실제 차트를 그리는 대신, `react-native-webview`를 사용하여
 * 웹에 만들어 둔 전용 차트 페이지(`chart-embed`)를 렌더링합니다.
 *
 * 주요 역할:
 * 1. WebView 렌더링: `chart-embed` 페이지를 로드하는 WebView를 화면에 표시합니다.
 * 2. 서비스와 상호작용: 사용자의 인터랙션(예: 버튼 클릭)이 발생하면 `WebViewChartService`를 통해 WebView에 명령을 전달합니다.
 * 3. 양방향 통신 구현:
 *    - (RN -> WebView): `WebViewChartService`를 통해 `postMessage`를 호출합니다.
 *    - (WebView -> RN): WebView의 `onMessage` prop을 사용하여 웹페이지로부터 오는 이벤트를 수신하고 처리합니다.
 * 4. 팩토리 사용: `ChartServiceFactory`를 통해 현재 플랫폼('mobile')에 맞는 `WebViewChartService` 인스턴스를 동적으로 생성합니다.
 */
import React, { useRef, useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
// 실제 프로젝트에서는 `pnpm add react-native-webview`를 통해 패키지를 설치해야 합니다.
import { WebView } from 'react-native-webview';
import { ChartServiceFactory } from 'packages/chart-core/src/factory';
// 웹뷰에 로드할 페이지 URL. 실제 환경에서는 환경 변수로 관리하는 것이 좋습니다.
const EMBEDDABLE_CHART_URL = 'http://localhost:3000/chart-embed';
// 새로운 샘플 데이터
const sampleData2 = [
    { time: '2023-02-01', value: 150 },
    { time: '2023-02-02', value: 140 },
    { time: '2023-02-03', value: 160 },
    { time: '2023-02-04', value: 155 },
];
const sampleData3 = [
    { time: '2023-03-01', value: 80 },
    { time: '2023-03-02', value: 90 },
];
export const Chart = () => {
    const webviewRef = useRef(null);
    const chartServiceRef = useRef(null);
    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const [lastMessageFromWeb, setLastMessageFromWeb] = useState('');
    useEffect(() => {
        // --- 1. 어댑터 및 서비스 생성 ---
        const chartAdapter = {
            // Service가 호출할 postMessage. WebView ref를 사용하여 실제 메시지를 보냅니다.
            postMessage: (message) => {
                if (webviewRef.current && isWebViewReady) {
                    const jsonMessage = JSON.stringify(message);
                    console.log(`[Chart.tsx] WebView로 메시지 전송: ${jsonMessage}`);
                    webviewRef.current.postMessage(jsonMessage);
                }
                else {
                    console.warn('[Chart.tsx] 경고: WebView가 준비되지 않아 메시지를 보낼 수 없습니다.');
                }
            },
            onError: error => {
                console.error('[Chart.tsx] 서비스에서 오류 발생:', error.message);
            },
        };
        // 팩토리를 통해 모바일용 서비스 인스턴스 생성
        // 모바일에서는 차트 컨테이너 DOM이 없으므로 null 전달
        const service = ChartServiceFactory.create('mobile', chartAdapter, null);
        chartServiceRef.current = service;
        // --- 2. 컴포넌트 언마운트 시 리소스 정리 ---
        return () => {
            chartServiceRef.current?.destroy();
        };
    }, [isWebViewReady]); // WebView가 준비되면 어댑터를 다시 설정할 수 있도록 의존성 추가
    // --- 3. WebView로부터 메시지 수신 처리 ---
    const handleMessage = (event) => {
        const receivedMessage = event.nativeEvent.data;
        console.log(`[Chart.tsx] WebView로부터 메시지 수신: ${receivedMessage}`);
        setLastMessageFromWeb(receivedMessage);
        // 수신한 메시지를 서비스에 전달하여 추가 로직을 처리할 수 있습니다.
        chartServiceRef.current?.handleMessage(receivedMessage);
    };
    // --- 4. 데이터 업데이트 버튼 핸들러 ---
    const updateChartData = (data) => {
        if (chartServiceRef.current) {
            chartServiceRef.current.updateData(data);
        }
    };
    return (<SafeAreaView style={styles.container}>
      <View style={styles.webviewContainer}>
        <WebView ref={webviewRef} source={{ uri: EMBEDDABLE_CHART_URL }} onLoadEnd={() => setIsWebViewReady(true)} // WebView 로딩 완료 시 상태 업데이트
     onMessage={handleMessage} 
    // WebView 로딩 중 인디케이터 표시
    renderLoading={() => (<View style={styles.loadingContainer}>
              <ActivityIndicator size="large"/>
            </View>)} startInLoadingState={true}/>
      </View>
      <View style={styles.controlPanel}>
        <Text style={styles.statusText}>
          WebView Status: {isWebViewReady ? 'Ready' : 'Loading...'}
        </Text>
        <View style={styles.buttonGroup}>
          <Button title="Update to Data 2" onPress={() => updateChartData(sampleData2)} disabled={!isWebViewReady}/>
          <Button title="Update to Data 3" onPress={() => updateChartData(sampleData3)} disabled={!isWebViewReady}/>
        </View>
        <Text style={styles.logLabel}>Last event from Web:</Text>
        <Text style={styles.logText} numberOfLines={2}>
          {lastMessageFromWeb || 'No events yet'}
        </Text>
      </View>
    </SafeAreaView>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    webviewContainer: {
        height: 300,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    controlPanel: {
        padding: 16,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    logLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
    },
    logText: {
        marginTop: 4,
        padding: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        fontFamily: 'monospace',
        fontSize: 12,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
