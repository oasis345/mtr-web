// packages/finance/src/types/market.ts
export type MarketAsset = 'stock' | 'crypto';
export type TimeRange = 'realtime' | '1d' | '1w' | '1m' | '3m' | '1y';
export type MarketDataType = 'marketCap' | 'volume' | 'gainers' | 'losers' | 'price';

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
