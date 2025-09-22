// 옵션 2: 기간별 분리
export enum ChartShortTimeframe {
  ONE_MINUTE = '1m',
  THREE_MINUTES = '3m',
  FIVE_MINUTES = '5m',
  TEN_MINUTES = '10m',
  FIFTEEN_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  ONE_HOUR = '1h',
}

export enum ChartLongTimeframe {
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
  ONE_YEAR = '12M',
}

export type ChartTimeframe = ChartShortTimeframe | ChartLongTimeframe;

// 모든 값 배열 (유효성 검사용)
export const ALL_TIMEFRAMES: ChartTimeframe[] = [
  ...Object.values(ChartShortTimeframe),
  ...Object.values(ChartLongTimeframe),
];
