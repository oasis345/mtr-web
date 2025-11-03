import { ChartLongTimeframe, ChartShortTimeframe, ChartTimeframe } from '../types';

export interface CacheConfig {
  staleTime: number;
  gcTime: number;
}

export const getTTLbyTimeframe = (timeframe: ChartTimeframe): CacheConfig => {
  // ✅ 단기 타임프레임 (분봉, 시간봉)
  if (Object.values(ChartShortTimeframe).includes(timeframe as ChartShortTimeframe)) {
    switch (timeframe) {
      case ChartShortTimeframe.ONE_MINUTE:
        return {
          staleTime: 1000 * 30, // 30초
          gcTime: 1000 * 60 * 5, // 5분
        };
      case ChartShortTimeframe.THREE_MINUTES:
        return {
          staleTime: 1000 * 30, // 30초
          gcTime: 1000 * 60 * 5, // 10분
        };
      case ChartShortTimeframe.FIVE_MINUTES:
        return {
          staleTime: 1000 * 60, // 1분
          gcTime: 1000 * 60 * 5, // 10분
        };
      case ChartShortTimeframe.TEN_MINUTES:
        return {
          staleTime: 1000 * 60, // 1분
          gcTime: 1000 * 60 * 5, // 10분
        };
      case ChartShortTimeframe.THIRTY_MINUTES:
        return {
          staleTime: 1000 * 60, // 1분
          gcTime: 1000 * 60 * 5, // 10분
        };
      case ChartShortTimeframe.ONE_HOUR:
        return {
          staleTime: 1000 * 60, // 1분
          gcTime: 1000 * 60 * 5, // 10분
        };
      default:
        return {
          staleTime: 1000 * 60, // 1분
          gcTime: 1000 * 60 * 5, // 10분
        };
    }
  }

  // ✅ 장기 타임프레임 (일봉, 주봉, 월봉, 년봉)
  if (Object.values(ChartLongTimeframe).includes(timeframe as ChartLongTimeframe)) {
    switch (timeframe) {
      case ChartLongTimeframe.ONE_DAY:
        return {
          staleTime: 30 * 60_000, // 30분
          gcTime: 2 * 60 * 60_000, // 2시간
        };
      case ChartLongTimeframe.ONE_WEEK:
        return {
          staleTime: 2 * 60 * 60_000, // 2시간
          gcTime: 24 * 60 * 60_000, // 24시간
        };
      case ChartLongTimeframe.ONE_MONTH:
        return {
          staleTime: 24 * 60 * 60_000, // 24시간
          gcTime: 7 * 24 * 60 * 60_000, // 7일
        };
      case ChartLongTimeframe.ONE_YEAR:
        return {
          staleTime: 7 * 24 * 60 * 60_000, // 7일
          gcTime: 30 * 24 * 60 * 60_000, // 30일
        };
      default:
        return {
          staleTime: 30 * 60_000, // 30분
          gcTime: 2 * 60 * 60_000, // 2시간
        };
    }
  }

  // ✅ 기본값 (예상치 못한 타임프레임)
  return {
    staleTime: 60_000, // 1분
    gcTime: 10 * 60_000, // 10분
  };
};

// ✅ 추가 유틸리티 함수들
export const getStaleTimeByTimeframe = (timeframe: ChartTimeframe): number => {
  return getTTLbyTimeframe(timeframe).staleTime;
};

export const getGcTimeByTimeframe = (timeframe: ChartTimeframe): number => {
  return getTTLbyTimeframe(timeframe).gcTime;
};

// ✅ 시장 시간 고려한 다이나믹 TTL (선택사항)
export const getDynamicTTLbyTimeframe = (timeframe: ChartTimeframe): CacheConfig => {
  const baseConfig = getTTLbyTimeframe(timeframe);
  const now = new Date();
  const hour = now.getHours();

  // 시장 활성 시간 (9시-15시) 고려
  const isMarketActive = hour >= 9 && hour <= 15;

  // 단기 타임프레임이고 시장이 활성화된 경우 staleTime 단축
  if (isMarketActive && Object.values(ChartShortTimeframe).includes(timeframe as ChartShortTimeframe)) {
    return {
      ...baseConfig,
      staleTime: Math.floor(baseConfig.staleTime * 0.7), // 30% 단축
    };
  }

  return baseConfig;
};
