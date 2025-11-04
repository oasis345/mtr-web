// 옵션 2: 기간별 분리
export enum ChartShortTimeframe {
  ONE_MINUTE = '1T',
  THREE_MINUTES = '3T',
  FIVE_MINUTES = '5T',
  TEN_MINUTES = '10T',
  THIRTY_MINUTES = '30T',
  ONE_HOUR = '1H',
}

export enum ChartLongTimeframe {
  ONE_DAY = '1D',
  ONE_WEEK = '1W',
  ONE_MONTH = '1M',
  ONE_YEAR = '12M',
}

export type ChartTimeframe = ChartShortTimeframe | ChartLongTimeframe;

// 모든 값 배열 (유효성 검사용)
export const ALL_TIMEFRAMES: ChartTimeframe[] = [
  ...Object.values(ChartShortTimeframe),
  ...Object.values(ChartLongTimeframe),
];

export const isLongTimeframe = (timeframe: ChartTimeframe): timeframe is ChartTimeframe => {
  return Object.values(ChartLongTimeframe).includes(timeframe as ChartLongTimeframe);
};

export const isShortTimeframe = (timeframe: ChartTimeframe): timeframe is ChartShortTimeframe => {
  return Object.values(ChartShortTimeframe).includes(timeframe as ChartShortTimeframe);
};
