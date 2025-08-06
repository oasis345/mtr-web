import { MarketTab, TimeRangeTab } from '../types/tabs';

export const MARKET_CATEGORIES: MarketTab[] = [
  { label: '주식', value: 'stock' },
  { label: '코인', value: 'crypto' },
];

export const TIME_RANGES: TimeRangeTab[] = [
  { label: '실시간', value: 'realtime' },
  { label: '1일', value: '1d' },
  { label: '1주일', value: '1w' },
  { label: '1개월', value: '1m' },
  { label: '3개월', value: '3m' },
  { label: '1년', value: '1y' },
];
