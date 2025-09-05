// packages/finance/src/types/market.ts
export enum MarketAsset {
  STOCKS = 'stocks',
  CRYPTO = 'crypto',
}

export enum TimeRange {
  REALTIME = 'realtime',
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1m',
  THREE_MONTHS = '3m',
  ONE_YEAR = '1y',
}

export enum MarketDataType {
  MOST_ACTIVE = 'mostActive',
  GAINERS = 'gainers',
  LOSERS = 'losers',
}

export interface MarketTab {
  label: string;
  value: MarketAsset;
}

export interface TimeRangeTab {
  label: string;
  value: TimeRange;
}

export interface MarketDataTypeTab {
  label: string;
  value: MarketDataType;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  volume: number;
  marketCap: number;
  asset: MarketAsset;
}
