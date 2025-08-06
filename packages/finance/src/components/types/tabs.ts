// packages/finance/src/types/market.ts
export type MarketCategory = 'stock' | 'crypto';
export type TimeRange = 'realtime' | '1d' | '1w' | '1m' | '3m' | '1y';

export interface MarketTab {
  label: string;
  value: MarketCategory;
}

export interface TimeRangeTab {
  label: string;
  value: TimeRange;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  category: MarketCategory;
}

export interface MarketColumn {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}
