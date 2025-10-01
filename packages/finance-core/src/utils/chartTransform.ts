import { Candle, ChartTimeframe, ChartShortTimeframe, ChartLongTimeframe } from '../types';
import { dayjs } from '@mtr/utils';

export type ChartCandle = {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// LightWeightCharts에서 사용하는 볼륨 형태
export type ChartVolume = {
  time: string | number;
  value: number;
  color?: string;
};

// 변환된 차트 데이터
export type ChartData = {
  candles: ChartCandle[];
  volumes: ChartVolume[];
};

/**
 * ChartTimeframe에 따라 적절한 시간 포맷으로 변환
 */
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formatTimeByTimeframe = (timestamp: string, timeframe: ChartTimeframe): string | number => {
  // UTC timestamp를 브라우저 시간대로 변환
  const date = dayjs(timestamp).tz(browserTimezone);

  // 짧은 timeframe (분/시간 단위) - Unix timestamp 사용
  if (Object.values(ChartShortTimeframe).includes(timeframe as ChartShortTimeframe)) {
    return date.unix(); // Unix timestamp (number)
  }

  // 긴 timeframe (일/주/월 단위) - 날짜 문자열 사용
  if (Object.values(ChartLongTimeframe).includes(timeframe as ChartLongTimeframe)) {
    switch (timeframe) {
      case ChartLongTimeframe.ONE_DAY:
        return date.format('YYYY-MM-DD');
      case ChartLongTimeframe.ONE_WEEK:
        // 주의 시작일 (월요일)로 정규화
        return date.startOf('week').format('YYYY-MM-DD');
      case ChartLongTimeframe.ONE_MONTH:
        // 월의 첫날로 정규화
        return date.startOf('month').format('YYYY-MM-DD');
      case ChartLongTimeframe.ONE_YEAR:
        // 년의 첫날로 정규화
        return date.startOf('year').format('YYYY-MM-DD');
      default:
        return date.format('YYYY-MM-DD');
    }
  }

  // 기본값: Unix timestamp
  return date.unix();
};

// 안전한 오름차순 + 중복제거
const toTs = (t: any) => {
  if (typeof t === 'number') return t;
  if (typeof t === 'string') return Math.floor(new Date(t).getTime() / 1000);
  return Math.floor(new Date(t.year, t.month - 1, t.day).getTime() / 1000);
};

export const transformCandlesToChart = (
  candles: Candle[],
  timeframe: ChartTimeframe,
): ChartCandle[] => {
  const sorted = [...candles].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const seen = new Set<number>();
  return sorted
    .map(c => ({ time: formatTimeByTimeframe(c.timestamp, timeframe), ...c }))
    .filter(d => {
      const k = toTs(d.time);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
};

export const transformCandlesToVolume = (
  candles: Candle[],
  timeframe: ChartTimeframe,
): ChartVolume[] => {
  const sorted = [...candles].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const seen = new Set<number>();
  return sorted
    .map(c => ({
      time: formatTimeByTimeframe(c.timestamp, timeframe),
      value: c.volume,
      color: c.close >= c.open ? '#22c55e' : '#ef4444',
    }))
    .filter(d => {
      const k = toTs(d.time);
      if (seen.has(k)) return false;
      seen.add(k);
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
export const transformSingleCandleToChart = (
  candle: Candle,
  timeframe: ChartTimeframe,
): ChartCandle => ({
  time: formatTimeByTimeframe(candle.timestamp, timeframe),
  ...candle,
});

/**
 * 단일 캔들을 볼륨 형태로 변환 (실시간 업데이트용)
 */
export const transformSingleCandleToVolume = (
  candle: Candle,
  timeframe: ChartTimeframe,
): ChartVolume => ({
  time: formatTimeByTimeframe(candle.timestamp, timeframe),
  value: candle.volume,
  color: candle.close >= candle.open ? '#22c55e' : '#ef4444',
});
