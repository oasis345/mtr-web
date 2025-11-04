import { dayjs } from '@mtr/utils';
import { Candle, ChartTimeframe } from '../types';

export type ChartCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// LightWeightCharts에서 사용하는 볼륨 형태
export type ChartVolume = {
  time: number;
  value: number;
  color?: string;
};

// 변환된 차트 데이터
export type ChartData = {
  candles: ChartCandle[];
  volumes: ChartVolume[];
};

export const formatTimeByTimeframe = (timestamp: string, timeframe: ChartTimeframe) => {
  // UTC timestamp 문자열을 명시적으로 UTC로 파싱합니다.
  const date = dayjs.utc(timestamp);
  return date.unix(); // UTC 기준의 유닉스 타임스탬프(초)를 반환합니다.
};

export const transformCandlesToChart = (candles: Candle[], timeframe: ChartTimeframe): ChartCandle[] => {
  const sorted = [...candles].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const seen = new Set<number>();
  return sorted
    .map(c => ({ time: formatTimeByTimeframe(c.timestamp, timeframe), ...c }))
    .filter(d => {
      if (seen.has(d.time)) return false;
      seen.add(d.time);
      return true;
    });
};

export const transformCandlesToVolume = (candles: Candle[], timeframe: ChartTimeframe): ChartVolume[] => {
  const sorted = [...candles].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const seen = new Set<number>();
  return sorted
    .map(c => ({
      time: formatTimeByTimeframe(c.timestamp, timeframe),
      value: c.volume,
      color: c.close >= c.open ? '#3b82f6' : '#ef4444',
    }))
    .filter(d => {
      if (seen.has(d.time)) return false;
      seen.add(d.time);
      return true;
    });
};

/**
 * 백엔드 캔들 데이터를 차트용 데이터로 변환 (timeframe 포함)
 */
export const transformToChartData = (candles: Candle[], timeframe: ChartTimeframe): ChartData => {
  return {
    candles: transformCandlesToChart(candles, timeframe),
    volumes: transformCandlesToVolume(candles, timeframe),
  };
};

/**
 * 단일 캔들을 차트 형태로 변환 (실시간 업데이트용)
 */
export const transformSingleCandleToChart = (candle: Candle, timeframe: ChartTimeframe): ChartCandle => ({
  time: formatTimeByTimeframe(candle.timestamp, timeframe),
  ...candle,
});

/**
 * 단일 캔들을 볼륨 형태로 변환 (실시간 업데이트용)
 */
export const transformSingleCandleToVolume = (candle: Candle, timeframe: ChartTimeframe): ChartVolume => ({
  time: formatTimeByTimeframe(candle.timestamp, timeframe),
  value: candle.volume,
  color: candle.close >= candle.open ? '#22c55e' : '#ef4444',
});
